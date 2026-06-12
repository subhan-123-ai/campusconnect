const getPublicFileUrl = (req, filePath) => {
  if (!filePath) return null;
  if (filePath.startsWith('http://') || filePath.startsWith('https://')) {
    return filePath;
  }

  const base =
    process.env.BACKEND_URL ||
    `${req.protocol}://${req.get('host')}`;

  const normalized = filePath.startsWith('/') ? filePath : `/${filePath}`;
  return `${base.replace(/\/$/, '')}${normalized}`;
};

module.exports = { getPublicFileUrl };
