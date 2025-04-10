import { closeMenuAddPopup } from './menuAddPopup.js';
import { fetchMenus } from './menu.js';

export function initMenuFormHandler() {
    const form = document.getElementById("menu-add-form");
    if (!form) return;

    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const formData = new FormData(this);
        const imageFile = document.getElementById('image').files[0];

        // ✅ 이미지 유효성 검사
        if (!imageFile) {
            alert("이미지 파일을 선택해주세요.");
            return;
        }

        const fileName = imageFile.name;
        const isValidImage = fileName && fileName.includes(".") && fileName.lastIndexOf(".") < fileName.length - 1;
        if (!isValidImage) {
            alert("유효한 확장자를 가진 이미지 파일을 선택해주세요.");
            return;
        }

        formData.append("image", imageFile);

        try {
            const response = await fetch("/admin/menus", {
                method: "POST",
                body: formData
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`메뉴 등록에 실패했습니다: ${errorText}`);
            }

            alert("✅ 메뉴가 등록되었습니다!");
            closeMenuAddPopup();
            await fetchMenus();
        } catch (err) {
            alert(`❌ 등록 실패: ${err.message}`);
            console.error("등록 오류:", err);
        }
    });
}
