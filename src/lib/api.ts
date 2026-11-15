const API_URL_THREADS = "/api/threads"

const handlerResponse = async (res: Response) => {
    const data = await res.json();
    if (!res.ok) {
        throw new Error(data.error || "Something went wrong ")
    }
    return data
}


// Bagian ambil semua data thread pakei fetchThread()
export const fetchThreads = async () => {
    const res = await fetch(`${API_URL_THREADS}`);
    return handlerResponse(res);
}

// Bagian buat thread baru pakai createThread()
// Catatan
// wajib title dan description 
// opsional Image atau Video
export const createThread = async (formData: FormData) => {
    const res = await fetch(`${API_URL_THREADS}`, {
        method: "POST",
        body: formData,
    });
    return handlerResponse(res);
}

// Bagian edit thread pakai editThread()
// Catatan 
// hanya perlu threadId
// cuman edit title dan description untuk file tidak bisa diubah atau dihapus
export const editThread = async (threadId: string, formData: FormData) => {
    const res = await fetch(`${API_URL_THREADS}/${threadId}`, {
        method: "PATCH",
        body: formData,
    });
    return handlerResponse(res);
}

// Bagian hapus thread pakai deleteThread()
// Catatan 
// hanya perlu threadId
export const deleteThread = async (threadId: string) => {
    const res = await fetch(`${API_URL_THREADS}/${threadId}`, {
        method: "DELETE"
    });
    return handlerResponse(res);
}


// Bagian toggle like thread pakai toggleLikeThread()
// Catatan 
// hanya perlu threadId
export const toggleLikeThread = async (threadId: string) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/likes`, {
    method: "POST",
  });
  return handlerResponse(res);
};

// Bagian toggle dislike thread pakai toggleDislikeThread()
// catatan
// hanya perlu threadId
export const toggleDislikeThread = async (threadId: string) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/dislikes`, {
    method: "POST",
  });
  return handlerResponse(res);
};

// Ambil semua komentar di suatu thread pakai fetchComments()
// Catatan 
// hanya perlu threadId
export const fetchComments = async (threadId: string) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/comments`);
  return handlerResponse(res);
};

// Tambah komentar baru pakai addComment()
// Catatan 
// perlu threadId 
// formData berisi 'context'
export const addComment = async (threadId: string, formData: FormData) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/comments`, {
    method: "POST",
    body: formData,
  });
  return handlerResponse(res);
};

// Hapus komentar pakai deleteComment()
// Catatan 
// perlu threadId dan commentId berupa number
export const deleteComment = async (threadId: string, commentId: number) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/comments/${commentId}`, {
    method: "DELETE",
  });
  return handlerResponse(res);
};

// Toggle Like Komentar pakai toggleLikeComment()
// Catatan 
// perlu threadId dan commentId berupa number
export const toggleLikeComment = async (threadId: string, commentId: number) => {
  const res = await fetch(`${API_URL_THREADS}/${threadId}/comments/${commentId}/likes`, {
    method: "POST",
  });
  return handlerResponse(res);
};