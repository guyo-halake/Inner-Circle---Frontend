"use client";

import { useState, useRef } from 'react';
import ReactCrop, { type Crop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { useAuthStore } from '@/store/useAuthStore';
import { Camera, Upload, Check } from 'lucide-react';
import { API_URL } from '@/lib/api';

export function AvatarUpload() {
  const { user, login } = useAuthStore();
  const [imgSrc, setImgSrc] = useState('');
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<Crop>();
  const imgRef = useRef<HTMLImageElement>(null);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCrop(undefined); // Makes crop preview update between images
      const reader = new FileReader();
      reader.addEventListener('load', () => setImgSrc(reader.result?.toString() || ''));
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const onUpload = async () => {
    if (completedCrop && imgRef.current) {
      const canvas = document.createElement('canvas');
      const scaleX = imgRef.current.naturalWidth / imgRef.current.width;
      const scaleY = imgRef.current.naturalHeight / imgRef.current.height;
      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      if (ctx) {
        ctx.drawImage(
          imgRef.current,
          completedCrop.x * scaleX,
          completedCrop.y * scaleY,
          completedCrop.width * scaleX,
          completedCrop.height * scaleY,
          0,
          0,
          completedCrop.width,
          completedCrop.height
        );

        canvas.toBlob(async (blob) => {
          if (blob) {
            const formData = new FormData();
            formData.append('avatar', blob, 'avatar.jpg');

            try {
              const response = await fetch(`${API_URL}/api/users/avatar`, {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
                body: formData,
              });

              if (!response.ok) {
                throw new Error('Failed to upload avatar');
              }

              const { avatarUrl } = await response.json();
              const updatedUser = { ...user!, avatarUrl };
              login(updatedUser, localStorage.getItem('token')!);
              setImgSrc('');
            } catch (error) {
              console.error(error);
            }
          }
        }, 'image/jpeg');
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={onSelectFile} />
      {imgSrc && (
        <div>
          <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)}>
            <img ref={imgRef} src={imgSrc} />
          </ReactCrop>
          <button onClick={onUpload}>Upload</button>
        </div>
      )}
    </div>
  );
}
