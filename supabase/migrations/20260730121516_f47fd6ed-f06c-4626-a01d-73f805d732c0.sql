DROP POLICY IF EXISTS "Memberships viewable by all" ON public.community_members;

CREATE OR REPLACE FUNCTION public.is_community_member(_community_id uuid, _user_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.community_members cm
    WHERE cm.community_id = _community_id AND cm.user_id = _user_id
  )
$$;

CREATE POLICY "Members view memberships of their communities"
ON public.community_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid()
  OR public.is_community_member(community_id, auth.uid())
);

CREATE OR REPLACE FUNCTION public.community_member_counts()
RETURNS TABLE (community_id uuid, member_count bigint)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT cm.community_id, count(*)::bigint
  FROM public.community_members cm
  GROUP BY cm.community_id
$$;

REVOKE SELECT ON public.community_members FROM anon;
GRANT EXECUTE ON FUNCTION public.community_member_counts() TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.is_community_member(uuid, uuid) TO authenticated;