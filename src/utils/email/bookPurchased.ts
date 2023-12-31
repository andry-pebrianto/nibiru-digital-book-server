import { htmlTemplateBottom, htmlTemplateTop } from "./template";

export const bookPurchased = ({
  link,
  bookTitle,
}: {
  link: string;
  bookTitle: string;
}) => {
  const htmlContent = `
  <p>
    Anda menerima email ini karena Anda telah melakukan pembelian buku (${bookTitle}) di Nibiru Digital Book.
    <br>
    Anda bisa mendapatkan file PDF dari buku tersebut melalui link di bawah ini:
  </p>

  <a href="${link}" style="color: white;" class="auth-button">Read Book</a>
  
  <p>
    Link alternatif: <a href="${link}">${link}</a>
  </p>

  <hr>

  <p>Copyright &copy; ${new Date().getFullYear()} Nibiru Digital Book - Developed with <span style="color: red !important;">❤️</span> by <a style="text-decoration: none;" href="https://github.com/andry-pebrianto" target="_blank">Andry Pebrianto</a> in Tangerang</p>`;

  return htmlTemplateTop + htmlContent + htmlTemplateBottom;
};
