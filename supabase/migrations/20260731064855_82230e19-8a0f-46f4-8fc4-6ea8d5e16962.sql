CREATE POLICY "Authenticated can view chat images"
ON storage.objects FOR SELECT TO authenticated
USING (bucket_id = 'chat-images');

CREATE POLICY "Users upload own chat images"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users delete own chat images"
ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'chat-images' AND auth.uid()::text = (storage.foldername(name))[1]);