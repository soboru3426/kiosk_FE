export function initMenuPopup() {
    const menuBtn = document.querySelector(".menu-btn");
    if (menuBtn) {
        menuBtn.addEventListener("click", showMenuAddPopup);
    }

    const menuAddPopup = document.getElementById("menu-add-popup");
    if (menuAddPopup) {
        menuAddPopup.addEventListener("click", (e) => {
            if (e.target.id === "menu-add-popup") {
                closeMenuAddPopup();
            }
        });
    }

    // 파일 업로드 관련 처리
    const menuImageInput = document.getElementById('image');
    const previewImg = document.getElementById('preview-img');
    const fileNameDisplay = document.getElementById('file-name');
    const dragDropText = document.getElementById('drag-drop-text');
    const uploadBox = document.querySelector('.upload-box');
    const browseButton = document.querySelector('.browse');

    // ✅ browse 클릭 시 input 열기
    if (browseButton) {
        browseButton.addEventListener('click', () => {
            menuImageInput.click();
        });
    }

    // ✅ 파일 선택 시 미리보기 처리
    if (menuImageInput) {
        menuImageInput.addEventListener('change', function (event) {
            const file = event.target.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    previewImg.src = e.target.result;
                    previewImg.style.display = 'block';
                };
                reader.readAsDataURL(file);
                fileNameDisplay.textContent = file.name;
                fileNameDisplay.style.display = 'block';
                dragDropText.style.display = 'none';
            }
        });
    }

    // ✅ 드래그 & 드롭
    if (uploadBox) {
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragging');
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('dragging');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragging');

            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith("image/")) {
                const reader = new FileReader();
                reader.onload = function (event) {
                    previewImg.src = event.target.result;
                    previewImg.style.display = 'block';
                    fileNameDisplay.textContent = file.name;
                    fileNameDisplay.style.display = 'block';
                    dragDropText.style.display = 'none';
                };
                reader.readAsDataURL(file);

                // ✅ 드롭한 파일을 input에 반영 (FormData 전송 위해 반드시 필요!)
                const dataTransfer = new DataTransfer();
                dataTransfer.items.add(file);
                menuImageInput.files = dataTransfer.files;
            }
        });
    }
}

export function showMenuAddPopup() {
    const popup = document.getElementById("menu-add-popup");
    if (popup) {
        popup.style.display = "flex";
        document.body.classList.add("no-scroll");
    }
}

export function closeMenuAddPopup() {
    const popup = document.getElementById("menu-add-popup");
    if (popup) {
        popup.style.display = "none";
        document.body.classList.remove("no-scroll");
    }
}
