import React from 'react';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { User, MapPin, Code2, Edit3, ShieldCheck } from 'lucide-react';
import { FreelancerProfile } from '../../types';

export interface ProfessionalProfileSummaryProps {
  profile: FreelancerProfile;
  onEditProfile?: () => void;
}

export const ProfessionalProfileSummary: React.FC<ProfessionalProfileSummaryProps> = ({
  profile,
  onEditProfile
}) => {
  return (
    <Card borderVariant="wine" className="space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700">
            <User className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">How Signal AI Understands You</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onEditProfile} icon={<Edit3 className="w-3.5 h-3.5" />}>
          Edit Profile
        </Button>
      </div>

      <div className="flex items-start gap-4">
        <div className="relative shrink-0">
          <div className="w-14 h-14 rounded-2xl bg-rose-900 border border-rose-700 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-rose-900/20">
            {profile.name.split(' ').map(n => n[0]).join('')}
          </div>
          <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-emerald-500 border-2 border-white text-white">
            <ShieldCheck className="w-3 h-3" />
          </span>
        </div>

        <div className="space-y-1 min-w-0 flex-1">
          <h4 className="text-base font-extrabold text-slate-900 truncate">{profile.name}</h4>
          <p className="text-xs font-semibold text-rose-700 truncate">{profile.title}</p>
          <p className="text-xs text-slate-500 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {profile.location}
          </p>
        </div>
      </div>

      <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200">
        &ldquo;{profile.bio}&rdquo;
      </p>

      <div className="space-y-2">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
          <Code2 className="w-3.5 h-3.5 text-rose-700" />
          Indexed Core Skills
        </span>
        <div className="flex flex-wrap gap-1.5">
          {profile.primarySkills.map((skill) => (
            <Badge key={skill} variant="brand" size="sm">
              {skill}
            </Badge>
          ))}
        </div>
      </div>
    </Card>
  );
};
