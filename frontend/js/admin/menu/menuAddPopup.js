'use strict';

/**
 * initMenuPopup(): 초기 메뉴 추가 팝업 및 파일 업로드 보안 강화된 이벤트 초기화
 * - XSS 방지: user-controlled 값은 textContent로 안전하게 삽입
 * - 파일 검증: 최대 5MB, 이미지 확장자(.jpg, .jpeg, .png, .gif) 및 MIME 타입 확인
 * - 에러 핸들링: 예외 발생 시 콘솔 로깅
 */
export function initMenuPopup() {
    const menuBtn = document.querySelector('.menu-btn');
    const menuAddPopup = document.getElementById('menu-add-popup');
    const menuImageInput = document.getElementById('image');
    const previewImg = document.getElementById('preview-img');
    const fileNameDisplay = document.getElementById('file-name');
    const dragDropText = document.getElementById('drag-drop-text');
    const uploadBox = document.querySelector('.upload-box');
    const browseButton = document.querySelector('.browse');
    
    // 팝업 열기
    menuBtn?.addEventListener('click', showMenuAddPopup);
    // 팝업 닫기 (배경 클릭)
    menuAddPopup?.addEventListener('click', (e) => {
        if (e.target === menuAddPopup) closeMenuAddPopup();
    });

    // 브라우저 버튼 클릭 시 파일 선택창 오픈
    browseButton?.addEventListener('click', () => menuImageInput?.click());

    // 파일 검증 상수
    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
    const ALLOWED_EXTS = ['.jpg', '.jpeg', '.png', '.gif','.webp'];

    // 공통 파일 처리 함수
    function handleFile(file) {
        try {
            if (!file) return;
            // 크기 검증
            if (file.size > MAX_FILE_SIZE) {
                alert('파일 크기는 5MB 이하만 허용됩니다.');
                return;
            }
            // MIME 타입 검증
            if (!ALLOWED_TYPES.includes(file.type)) {
                alert('지원되지 않는 파일 형식입니다.');
                return;
            }
            // 확장자 검증
            const ext = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            if (!ALLOWED_EXTS.includes(ext)) {
                alert('유효하지 않은 파일 확장자입니다.');
                return;
            }
            // FileReader로 미리보기
            const reader = new FileReader();
            reader.addEventListener('load', (ev) => {
                previewImg.src = ev.target.result;
                previewImg.alt = '업로드 미리보기';
                previewImg.style.display = 'block';
            });
            reader.readAsDataURL(file);

            // 파일 이름 표시
            fileNameDisplay.textContent = file.name;
            fileNameDisplay.style.display = 'block';
            dragDropText.style.display = 'none';

            // input 파일 리스트에 반영 (FormData 전송용)
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            menuImageInput.files = dataTransfer.files;
        } catch (err) {
            console.error('파일 처리 중 오류:', err);
            alert('파일 처리 중 오류가 발생했습니다.');
        }
    }

    // 파일 선택 시
    menuImageInput?.addEventListener('change', (e) => handleFile(e.target.files[0]));

    // 드래그 & 드롭
    uploadBox?.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadBox.classList.add('dragging');
    });
    uploadBox?.addEventListener('dragleave', () => uploadBox.classList.remove('dragging'));
    uploadBox?.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadBox.classList.remove('dragging');
        handleFile(e.dataTransfer.files[0]);
    });
}

/** 팝업 보이기, 화면 스크롤 잠금 */
export function showMenuAddPopup() {
    const popup = document.getElementById('menu-add-popup');
    if (!popup) return;
    popup.style.display = 'flex';
    document.body.classList.add('no-scroll');
}

/** 팝업 닫기, 화면 스크롤 잠금 해제 */
export function closeMenuAddPopup() {
    const popup = document.getElementById('menu-add-popup');
    if (!popup) return;
    popup.style.display = 'none';
    document.body.classList.remove('no-scroll');
}
