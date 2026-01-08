
import React, { useState, useRef } from 'react';

interface TutorProfileProps {
  navigateTo: (page: string) => void;
}

const TutorProfile: React.FC<TutorProfileProps> = ({ navigateTo }) => {
  const [profileImage, setProfileImage] = useState<string>("https://lh3.googleusercontent.com/aida-public/AB6AXuCm2bSISxXXezMKDvC_yH3TDpi9rtARee_nk2RmoqKc8Jro23Zi7OSjnUFc7SvCu4cgf0j7VOVMgcxGnHQXyqRehlzdFVfepdkyxlXZKc1RZaCpTxPDyEKiSgDBdmW1IEE9nJythadFUobP5qTtn0sWlXTeZYPj6yGk1ELEbfjsWgXAZmgDDVhP9cqAjJnfHIHoaNHt5VV0x3VY75YGBJuGcQ2tXIp1I13gjWA0uOcio1YC3POIZtiKF_N_9M2MJcqBK4z1TC7Xaw");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f6f7f8] dark:bg-[#101922] text-slate-900 dark:text-white overflow-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/95 dark:bg-[#101922]/95 backdrop-blur-md border-b dark:border-slate-800 p-4 flex items-center justify-between">
        <button onClick={() => navigateTo('tutor-dashboard')} className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-white/10 transition-colors">
          <span className="material-symbols-outlined">arrow_back</span>
        </button>
        <h2 className="text-lg font-extrabold">Meu Perfil</h2>
        <div className="w-10"></div> {/* Spacer for symmetry */}
      </header>

      <main className="flex-1 overflow-y-auto pb-32 no-scrollbar">
        {/* Profile Picture Section */}
        <div className="flex flex-col items-center py-10 px-6">
          <div className="relative">
            <div
              className="h-32 w-32 rounded-full bg-slate-200 dark:bg-slate-800 bg-cover bg-center border-4 border-white dark:border-slate-700 shadow-2xl transition-transform active:scale-95 cursor-pointer overflow-hidden"
              style={{ backgroundImage: `url(${profileImage})` }}
              onClick={handleImageClick}
            >
              {!profileImage && (
                <div className="flex items-center justify-center h-full">
                  <span className="material-symbols-outlined text-4xl text-slate-400">person</span>
                </div>
              )}
            </div>
            <button
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-primary text-white p-2.5 rounded-full shadow-lg border-4 border-[#f6f7f8] dark:border-[#101922] hover:scale-110 transition-transform active:scale-90"
            >
              <span className="material-symbols-outlined text-[18px] font-bold">photo_library</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="text-center mt-5">
            <h3 className="text-xl font-extrabold">Maria Silva</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-bold mt-1">maria.silva@email.com</p>
            <div className="inline-flex items-center gap-1.5 mt-3 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider">
              <span className="material-symbols-outlined text-[14px] filled">verified_user</span>
              Tutor Verificado
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="px-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Nome Completo</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">person</span>
              <input
                type="text"
                defaultValue="Maria Silva"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 focus:ring-2 focus:ring-primary/50 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">mail</span>
              <input
                type="email"
                defaultValue="maria.silva@email.com"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 focus:ring-2 focus:ring-primary/50 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Celular (WhatsApp)</label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">phone</span>
              <input
                type="tel"
                defaultValue="(11) 98765-4321"
                className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white dark:bg-[#1e242b] border dark:border-slate-800 focus:ring-2 focus:ring-primary/50 font-bold transition-all outline-none"
              />
            </div>
          </div>

          <div className="h-px bg-slate-200 dark:bg-slate-800 my-4"></div>

          <div className="space-y-4">
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest ml-1">Segurança</h4>
            <button
              onClick={() => navigateTo('change-password')}
              className="w-full flex items-center justify-between p-4 bg-white dark:bg-[#1e242b] border dark:border-slate-800 rounded-2xl group transition-all active:scale-[0.99]">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-500">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <span className="font-bold">Alterar Senha</span>
              </div>
              <span className="material-symbols-outlined text-slate-400 group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </div>
      </main>

      {/* Footer Save Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white/90 dark:bg-[#101922]/90 backdrop-blur-md border-t dark:border-slate-800 z-40 pb-10">
        <button
          onClick={() => navigateTo('tutor-dashboard')}
          className="w-full h-14 bg-primary hover:bg-blue-600 text-white font-extrabold text-lg rounded-2xl shadow-xl shadow-primary/30 flex items-center justify-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">save</span>
          <span>Salvar Alterações</span>
        </button>
      </div>
    </div>
  );
};

export default TutorProfile;
