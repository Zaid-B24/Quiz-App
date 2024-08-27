import toast from 'react-hot-toast';

export default function copyLink(id, type) {
  const url = new URL(window.location.href);
  url.pathname = '';
  const modifiedUrl = url.href;
  navigator.clipboard.writeText(`${modifiedUrl}user/${type}/${id}`);
  toast.success('URL copied to clipboard');
}
