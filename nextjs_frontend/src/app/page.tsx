'use client';

import React, { useEffect, useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useTheme } from "./hooks/useTheme";
import { useNotes } from "./hooks/useNotes";
import { renderMarkdown } from "./markdown";

function Login() {
  const { login, signup, loading } = useAuth();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [err, setErr] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    try {
      if (mode === "login") await login(email, password);
      else await signup(email, password);
    } catch (errObj) {
      const typedErr = errObj as Error;
      setErr(typedErr.message || "Error during authentication.");
    }
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-[var(--color-background)]">
      <div className="border bg-[var(--color-surface)] p-8 rounded w-[20rem] shadow-md">
        <h1 className="text-3xl mb-4 retro-header">
          {mode === "login" ? "Sign In" : "Register"}
        </h1>
        <form className="space-y-3" onSubmit={submit}>
          <input
            className="w-full border p-2 rounded"
            required
            type="email"
            value={email}
            onChange={e=>setEmail(e.target.value)}
            placeholder="Email"
            autoFocus
          />
          <input
            className="w-full border p-2 rounded"
            required
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            placeholder="Password"
          />
          <button className="bg-[var(--color-accent)] text-white px-4 py-2 rounded" type="submit" disabled={loading}>
            {loading ? "..." : (mode === "login" ? "Login" : "Register")}
          </button>
          {err && <div className="text-red-600">{err}</div>}
        </form>
        <div className="pt-3 text-right">
          <button className="text-sm text-[var(--color-primary)] underline" type="button" onClick={()=>setMode(mode === "login" ? "signup" : "login")}>
            {mode === "login" ? "No account? Register" : "Already have account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
}

import type { NoteType } from "./hooks/useNotes";

function NotesApp() {
  const { token, logout, user } = useAuth();
  const {
    notes, tags, search, setSearch, selectedTag, setSelectedTag,
    selectedNoteId, setSelectedNoteId, createNote, updateNote, deleteNote, loading
  } = useNotes(token!);
  const [editNote, setEditNote] = useState<NoteType | null>(null);
  const [editorContent, setEditorContent] = useState<string>("");
  const [editorTitle, setEditorTitle] = useState<string>("");
  const [editorTags, setEditorTags] = useState<string[]>([]);
  const [isPreview, setIsPreview] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<string>("");

  // Load selected note into editor
  useEffect(() => {
    if (!selectedNoteId) {
      setEditNote(null);
      setEditorTitle("");
      setEditorContent("");
      setEditorTags([]);
      return;
    }
    const note = notes.find((n) => n.id === selectedNoteId);
    if (note) {
      setEditNote(note);
      setEditorTitle(note.title || "");
      setEditorContent(note.content || "");
      setEditorTags(note.tags || []);
    }
  }, [selectedNoteId, notes]);

  // Autosave as user edits (debounced)
  useEffect(() => {
    if (!editNote) return;
    const timeout = setTimeout(() => {
      updateNote(editNote.id, {
        title: editorTitle,
        content: editorContent,
        tags: editorTags,
      })
        .then(() => {
          setStatusMsg("Auto-saved");
          setTimeout(() => setStatusMsg(""), 1000);
        })
        .catch(() => setStatusMsg("Autosave error"));
    }, 1200);
    return () => clearTimeout(timeout);
  }, [editorTitle, editorContent, editorTags]); // eslint-disable-line

  const onCreateNote = async () => {
    await createNote({ title: "Untitled", content: "", tags: [] });
    // fetchNotes will update notes and selectedNote appropriately
    setTimeout(() => {
      if (notes.length > 0) setSelectedNoteId(notes[0].id);
    }, 100);
  };

  const onSaveManual = async () => {
    if (editNote)
      await updateNote(editNote.id, {
        title: editorTitle,
        content: editorContent,
        tags: editorTags,
      });
    setStatusMsg("Saved");
    setTimeout(() => setStatusMsg(""), 1100);
  };

  return (
    <div className="notes-app-main">
      <div className="sidebar flex-col">
        <div className="retro-header justify-between flex">
          <span>📝 Notes</span>
          <button
            onClick={onCreateNote}
            title="Create Note"
            className=" bg-[var(--color-success)] px-2 py-1 rounded text-white text-sm"
          >
            + New
          </button>
        </div>
        <div className="p-2">
          <input
            className="w-full border p-2 mb-2 rounded"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
          />
        </div>
        <div className="px-2 mb-3">
          <div className="mb-1 text-xs font-bold text-[var(--color-accent2)]">
            Tags
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              className={`px-2 py-1 rounded ${
                selectedTag === null
                  ? "bg-[var(--color-tag-bg)] font-bold"
                  : "bg-transparent"
              } text-xs`}
              onClick={() => setSelectedTag(null)}
            >
              All
            </button>
            {tags.map((tag) => (
              <button
                key={tag}
                className={`px-2 py-1 rounded ${
                  selectedTag === tag
                    ? "bg-[var(--color-tag-bg)] font-bold"
                    : "bg-transparent"
                } text-xs`}
                onClick={() => setSelectedTag(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
        <div className="note-list flex-1 overflow-y-auto">
          {loading && (
            <div className="p-3 text-xs text-gray-500">Loading...</div>
          )}
          {notes.map((note) => (
            <div
              key={note.id}
              className={`p-3 border-b cursor-pointer ${
                selectedNoteId === note.id ? "active" : ""
              }`}
              onClick={() => setSelectedNoteId(note.id)}
              tabIndex={0}
              aria-selected={selectedNoteId === note.id}
            >
              <div className="font-bold">{note.title || "Untitled"}</div>
              <div className="text-xs text-gray-500 truncate">
                {note.content.replace(/^#+\s/g, "").slice(0, 45)}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="main-panel flex-col">
        <div className="retro-header">
          <span>
            Hi{user?.email && `, ${user.email}`}
          </span>
          <div className="flex gap-2 items-center">
            <button
              className="bg-white/20 px-3 py-1 rounded text-white hover:bg-white/40"
              onClick={logout}
            >
              Logout
            </button>
            <ThemeSwitcher />
            <SettingsButton />
          </div>
        </div>
        <div className="flex flex-row flex-1 min-h-0">
          <div className="flex-1 p-5 flex flex-col">
            {editNote ? (
              <>
                <input
                  className="w-full text-2xl font-bold border-b p-1 mb-2 bg-transparent"
                  value={editorTitle}
                  onChange={(e) => setEditorTitle(e.target.value)}
                  placeholder="Title"
                  aria-label="Note title"
                />
                <TagEditor
                  tags={editorTags}
                  setTags={setEditorTags}
                  suggestionTags={tags}
                />
                <div className="flex gap-3 mt-2 mb-1">
                  <button
                    onClick={() => setIsPreview((p) => !p)}
                    className="bg-[var(--color-accent2)] px-3 py-1 rounded text-white"
                  >
                    {isPreview ? "Edit" : "Preview"}
                  </button>
                  <button
                    onClick={onSaveManual}
                    className="bg-[var(--color-primary)] px-3 py-1 rounded text-white"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Delete this note?")) {
                        deleteNote(editNote.id);
                        setSelectedNoteId(null);
                      }
                    }}
                    className="bg-red-500 px-3 py-1 rounded text-white"
                  >
                    Delete
                  </button>
                  <div className="text-xs text-gray-500 px-2 pt-2">
                    {statusMsg}
                  </div>
                </div>
                <div className="flex-1 flex pt-2">
                  {isPreview ? (
                    <div
                      className="w-full prose prose-sm min-h-[260px] p-2 border rounded bg-[var(--color-surface)] overflow-y-auto"
                      dangerouslySetInnerHTML={{
                        __html:
                          renderMarkdown(editorContent) || "<em>Nothing yet.</em>",
                      }}
                    />
                  ) : (
                    <textarea
                      className="w-full min-h-[260px] flex-1 p-2 border rounded bg-[var(--color-surface)] font-mono text-sm"
                      value={editorContent}
                      onChange={(e) => setEditorContent(e.target.value)}
                      aria-label="Markdown content"
                    />
                  )}
                </div>
              </>
            ) : (
              <div className="text-gray-400 pt-20 text-2xl text-center">
                ← Select a note, or create a new note.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      title="Switch Theme"
      onClick={toggleTheme}
      className="text-lg px-1"
      aria-label="Toggle theme"
    >
      {theme === "retro" ? "🌈" : "☀️"}
    </button>
  );
}

function SettingsButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button aria-label="Settings" title="Settings" className="text-lg px-1" onClick={()=>setOpen(o=>!o)}>
        ⚙️
      </button>
      {open && (
        <div className="absolute right-3 top-16 z-20 bg-white rounded border px-6 py-4 shadow-md flex flex-col gap-3">
          <div className="font-bold text-[var(--color-accent)]">Settings</div>
          <button className="underline" onClick={()=>window.open('https://github.com/', '_blank')}>About Project</button>
          <button className="underline" onClick={()=>setOpen(false)}>Close</button>
        </div>
      )}
    </>
  )
}

function TagEditor({ tags, setTags, suggestionTags }:
  { tags: string[], setTags: (tags: string[])=>void, suggestionTags: string[] }) {
  const [input, setInput] = useState("");
  const onEnter = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && input.trim().length > 0) {
      setTags([...tags, input.trim()]);
      setInput("");
    }
  };
  return (
    <div className="flex flex-wrap gap-1 mb-2 text-xs">
      {tags.map((tag, i) => (
        <span key={i} className="px-2 py-1 bg-[var(--color-tag-bg)] rounded">{tag}
          <button className="ml-1 text-xs" onClick={()=>setTags(tags.filter((_,j)=>j!==i))}>×</button>
        </span>
      ))}
      <input
        className="px-1 border rounded bg-white text-xs"
        type="text" value={input} onChange={e=>setInput(e.target.value)}
        onKeyDown={onEnter} placeholder="Add tag..."
        style={{ width: "6em" }}
      />
      {suggestionTags.filter(t => !tags.includes(t) && t.includes(input)).slice(0,3).map((tag, i) => (
        <button className="px-2 bg-gray-50 border rounded" key={i} type="button" onClick={() => { setTags([...tags, tag]); setInput(""); }}>
          {tag}
        </button>
      ))}
    </div>
  );
}

export default function Home() {
  const { token } = useAuth();
  return token ? <NotesApp /> : <Login />;
}
