import { ModalContainer, ModalLayoutJustify } from 'kwc';
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';

const defaultDeletePassword = 'delete';

const validate = (value: string) =>
  value.toLowerCase() === defaultDeletePassword ||
  'The delete pass is not correct';

type FormData = {
  deletePass: string;
};

type Props = {
  onSubmit: () => void;
  onCancel: () => void;
};

function TokenDeleteModal({ onSubmit, onCancel }: Props) {
  const {
    handleSubmit,
    setValue,
    register,
    unregister,
    errors,
    clearErrors,
  } = useForm<FormData>({ defaultValues: { deletePass: '' } });

  useEffect(() => {
    register('deletePass', { validate });
    return () => unregister('deletePass');
  }, [register, unregister]);

  return (
    <ModalContainer
      title="Modal Title"
      subtitle="To be sure, type the word “DELETE” and will be deleted now."
      onAccept={handleSubmit(onSubmit)}
      onCancel={onCancel}
      blocking
      error
    >
      <ModalLayoutJustify
        label="WRITE DELETE"
        onUpdate={(v: string) => {
          setValue('deletePass', v);
          clearErrors('deletePass');
        }}
        submit={handleSubmit(onSubmit)}
        error={errors.deletePass?.message as string}
      />
    </ModalContainer>
  );
}

export default TokenDeleteModal;
