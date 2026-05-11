import { useState, useCallback } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Encapsulates the standard CRUD modal pattern:
 *  - open/close modal state
 *  - editing item state
 *  - form state with field change helper
 *  - submit handler that dispatches save thunk and refetches
 *
 * @param {object}   emptyForm    Default form values
 * @param {function} saveThunk    RTK async thunk for create/update
 * @param {function} fetchThunk   RTK async thunk to refetch list after save
 * @param {function} mapToForm    Optional: maps an existing item to form values
 */
export function useCrudModal(emptyForm, saveThunk, fetchThunk, mapToForm = null) {
  const dispatch = useDispatch();

  const [isOpen,   setIsOpen]   = useState(false);
  const [editing,  setEditing]  = useState(null);
  const [form,     setForm]     = useState({ ...emptyForm });

  const openModal = useCallback((item = null) => {
    setEditing(item);
    setIsOpen(true);
    setForm(item
      ? (mapToForm ? mapToForm(item) : { ...item })
      : { ...emptyForm }
    );
  }, [emptyForm, mapToForm]);

  const closeModal = useCallback(() => {
    setEditing(null);
    setIsOpen(false);
    setForm({ ...emptyForm });
  }, [emptyForm]);

  /** Returns true if save succeeded (so caller can do extra work if needed) */
  const handleSubmit = useCallback(async (e, payload, fetchParams = {}) => {
    e?.preventDefault();
    const result = await dispatch(saveThunk({ id: editing?.id, payload }));
    if (saveThunk.fulfilled.match(result)) {
      closeModal();
      if (fetchThunk) dispatch(fetchThunk(fetchParams));
      return true;
    }
    return false;
  }, [dispatch, saveThunk, fetchThunk, editing, closeModal]);

  /** Field change helper: f('name') returns an onChange handler */
  const f = useCallback(
    (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value })),
    []
  );

  /** Direct field setter for non-input changes (e.g. file, boolean) */
  const setField = useCallback(
    (field, value) => setForm((prev) => ({ ...prev, [field]: value })),
    []
  );

  return { isOpen, editing, form, setForm, openModal, closeModal, handleSubmit, f, setField };
}
