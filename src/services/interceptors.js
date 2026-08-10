export const responseHandler = (response) => {
  if (response.data) {
    return response.data;
  }
  return { status: 'error', message: 'Respons kosong dari server', data: null };
};
