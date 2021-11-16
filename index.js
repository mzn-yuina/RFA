const validExtensions = ['image/jpeg', 'image/jpg', 'image/png'];
const orange = [255, 145, 0];
const threshold = 5 * 3;

const dropArea = document.querySelector('.drop-area');
const button = dropArea.querySelector('button');
const input = dropArea.querySelector('input');
button.onclick = () => { input.click() };

dropArea.addEventListener('dragover', (event) => {
  event.preventDefault();
  dropArea.classList.add('dragover');
});

dropArea.addEventListener('dragleave', () => {
  dropArea.classList.remove('dragover');
});

dropArea.addEventListener('drop', (event) => {
  event.preventDefault();

  const files = event.dataTransfer.files;
  for (const file of files) {
    handleFile(file);
  }
});

input.addEventListener('change', () => {
  const files = input.files;
  for (const file of files) {
    handleFile(file);
  }
});

// ------------------------------------------------- //

function difference(x, y) {
  return Math.abs(x[0] - y[0]) + Math.abs(x[1] - y[1]) + Math.abs(x[2] - y[2]);
}

function download(dataURL, filename) {
  const link = document.createElement('a');
  link.href = dataURL;
  link.download = filename;
  link.click();
}

function handleFile(file) {
  console.log(`handle ${file.name}`);

  if (!validExtensions.includes(file.type)) {
    console.warn(`invalid file type: ${file.type}`);
    return false;
  }

  const fileReader = new FileReader();
  fileReader.readAsDataURL(file);
  fileReader.onload = () => {
    const image = new Image();
    image.src = fileReader.result;
    image.onload = () => {
      console.log(`(${image.width}, ${image.height})`);

      const canvas = document.createElement('canvas');
      canvas.width = image.width;
      canvas.height = image.height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.drawImage(image, 0, 0);

      const scale_x = (x) => x / 1280 * image.width;
      const scale_y = (y) => y / 720 * image.height;

      const rgb = ctx.getImageData(scale_x(355), scale_y(420), 1, 1).data;
      if (difference(rgb, orange) < threshold) {
        // (x,y,w,h)=(340,160,600,70)/(1280,720)
        ctx.fillRect(scale_x(340), scale_y(160), scale_x(600), scale_y(70));
        download(canvas.toDataURL('image/jpg'), `${file.name.split('.')[0]}(summary).jpg`);
        console.log('summary');
        return true;
      } else {
        // (340,80,600,40)/(1280,720)
        ctx.fillRect(scale_x(340), scale_y(80), scale_x(600), scale_y(40));
        download(canvas.toDataURL('image/jpg'), `${file.name.split('.')[0]}(detail).jpg`);
        console.log('detail');
        return true;
      }
    };
  }
}

