
-- Profiles
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  avatar_url TEXT,
  country TEXT,
  bio TEXT,
  interests TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Communities
CREATE TABLE public.communities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  cover_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.communities TO anon, authenticated;
GRANT ALL ON public.communities TO service_role;
ALTER TABLE public.communities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Communities viewable by all" ON public.communities FOR SELECT USING (true);

-- Memberships
CREATE TABLE public.community_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(community_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.community_members TO authenticated;
GRANT SELECT ON public.community_members TO anon;
GRANT ALL ON public.community_members TO service_role;
ALTER TABLE public.community_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Memberships viewable by all" ON public.community_members FOR SELECT USING (true);
CREATE POLICY "Users join themselves" ON public.community_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave themselves" ON public.community_members FOR DELETE USING (auth.uid() = user_id);

-- Messages
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  community_id UUID NOT NULL REFERENCES public.communities(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  image_url TEXT,
  reply_to UUID REFERENCES public.messages(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX messages_community_idx ON public.messages(community_id, created_at DESC);
GRANT SELECT, INSERT, DELETE ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members can read messages" ON public.messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.community_members cm WHERE cm.community_id = messages.community_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Members can post messages" ON public.messages FOR INSERT TO authenticated WITH CHECK (
  auth.uid() = user_id AND
  EXISTS (SELECT 1 FROM public.community_members cm WHERE cm.community_id = messages.community_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Authors can delete own messages" ON public.messages FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Reactions
CREATE TABLE public.message_reactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES public.messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(message_id, user_id, emoji)
);
GRANT SELECT, INSERT, DELETE ON public.message_reactions TO authenticated;
GRANT ALL ON public.message_reactions TO service_role;
ALTER TABLE public.message_reactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reactions readable by members" ON public.message_reactions FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.messages m JOIN public.community_members cm ON cm.community_id = m.community_id
          WHERE m.id = message_reactions.message_id AND cm.user_id = auth.uid())
);
CREATE POLICY "Users add own reactions" ON public.message_reactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users remove own reactions" ON public.message_reactions FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;
ALTER PUBLICATION supabase_realtime ADD TABLE public.message_reactions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.community_members;

-- Seed communities
INSERT INTO public.communities (slug, name, description, category, cover_url) VALUES
  ('solo', 'Solo Travelers', 'For independent explorers seeking adventure on their own terms — and the occasional travel buddy.', 'solo', 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1600&q=80'),
  ('group', 'Group Travelers', 'Form crews, plan trips together, and split the costs with fellow wanderers.', 'group', 'https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=1600&q=80'),
  ('girls', 'Girls Travel Group', 'A safe, supportive space for women to plan trips, share tips, and travel together.', 'girls', 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&q=80'),
  ('boys', 'Boys Travel Group', 'Bro trips, road trips, adventure missions — find your travel squad here.', 'boys', 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=1600&q=80'),
  ('couples', 'Couples Travel Group', 'For couples planning getaways, honeymoons, and shared adventures around the world.', 'couples', 'https://images.unsplash.com/photo-1518621736915-f3b1c41bfd00?w=1600&q=80');
