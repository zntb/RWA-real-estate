import { CreatePropertyForm } from '@/components/CreatePropertyForm';
import { VerifyPropertyForm } from '@/components/VerifyPropertyForm';
import { AddVerifierForm } from '@/components/AddVerifierForm';
import { RemoveVerifierForm } from '@/components/RemoveVerifierForm';

export default function AdminPage() {
  return (
    <div className='mx-auto container py-8 space-y-8'>
      <CreatePropertyForm />
      <AddVerifierForm />
      <RemoveVerifierForm />
      <VerifyPropertyForm />
    </div>
  );
}
