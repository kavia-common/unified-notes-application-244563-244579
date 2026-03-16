'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  getTags,
} from '../api';

export type NoteType = {
  id: number;
  title: string;
  content: string;
  tags: string[];
};

export function useNotes(token: string | null) {
  const [notes, setNotes] = useState<NoteType[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedNoteId, setSelectedNoteId] = useState<number | null>(null);
  const [search, setSearch] = useState<string>('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(() => {
    if (!token) return;
    setLoading(true);
    getNotes(token, search, selectedTag || undefined)
      .then((data) => setNotes(data || []))
      .finally(() => setLoading(false));
  }, [token, search, selectedTag]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  useEffect(() => {
    if (!token) return;
    getTags(token).then(setTags);
  }, [token]);

  return {
    notes,
    tags,
    selectedNoteId, setSelectedNoteId,
    search, setSearch,
    selectedTag, setSelectedTag,
    loading,
    fetchNotes,
    createNote: async (data: { title: string; content: string; tags: string[] }) => {
      await createNote(token!, data);
      fetchNotes();
    },
    updateNote: async (id: number, data: { title?: string; content?: string; tags?: string[] }) => {
      await updateNote(token!, id, data);
      fetchNotes();
    },
    deleteNote: async (id: number) => {
      await deleteNote(token!, id);
      fetchNotes();
    }
  };
}
