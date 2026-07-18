// CONFIG: Cấu hình thời gian mở cổng tra cứu (Năm, Tháng - 1, Ngày, Giờ, Phút, Giây)
// Thử đặt ngày mở cổng là một ngày trong tương lai để test đồng hồ chạy đếm ngược nhé!
const TARGET_DATE = new Date(2026, 6, 18, 14, 00, 0); // Ví dụ: Ngày 25 tháng 7 năm 2026

let csvData = []; // Biến toàn cục để lưu trữ dữ liệu sau khi tải file CSV

// 1. XỬ LÝ ĐỒNG HỒ ĐẾM NGƯỢC
const countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = TARGET_DATE.getTime() - now;

    // Khi thời gian đếm ngược kết thúc hoặc mốc thời gian đã qua
    if (distance <= 0) {
        clearInterval(countdownInterval);
        
        // Đặt đồng hồ về 00
        document.getElementById("days").innerText = "00";
        document.getElementById("hours").innerText = "00";
        document.getElementById("minutes").innerText = "00";
        document.getElementById("seconds").innerText = "00";
        
        initSearchSystem(); // Kích hoạt hệ thống tra cứu
        return;
    }

    // Tính toán thời gian Ngày, Giờ, Phút, Giây
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Hiển thị ra giao diện
    document.getElementById("days").innerText = String(days).padStart(2, '0');
    document.getElementById("hours").innerText = String(hours).padStart(2, '0');
    document.getElementById("minutes").innerText = String(minutes).padStart(2, '0');
    document.getElementById("seconds").innerText = String(seconds).padStart(2, '0');

}, 1000);

// 2. KÍCH HOẠT GIAO DIỆN TRA CỨU VÀ TẢI CSV KHI HẾT GIỜ
function initSearchSystem() {
    document.getElementById("countdown-section").classList.add("hidden");
    document.getElementById("search-section").classList.remove("hidden");

    // Tải trước file dữ liệu ketqua.csv sẵn vào bộ nhớ để tra cứu nhanh hơn
    Papa.parse("ketqua.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            csvData = results.data;
            console.log("Dữ liệu CSV đã tải sẵn sàng!");
        },
        error: function() {
            const resultBox = document.getElementById('resultBox');
            resultBox.className = "result-box result-error";
            resultBox.style.display = "block";
            resultBox.innerHTML = "Không thể tải dữ liệu file CSV. Vui lòng kiểm tra lại file ketqua.csv!";
        }
    });
}

// 3. Sự kiện tra cứu
document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const sbdInput = document.getElementById("sbdInput");

    // Sự kiện khi click nút Tra cứu
    if (btnSearch) btnSearch.addEventListener("click", traCuuKetQua);

    // Sự kiện khi bấm nút Enter trên bàn phím
    if (sbdInput) {
        sbdInput.addEventListener("keyup", (event) => {
            if (event.key === "Enter") {
                traCuuKetQua();
            }
        });
    }  
});

// 4. Tra cứu kết quả và render giao diện đẹp mắt giống hình mẫu
function traCuuKetQua() {
    const sbdInput = document.getElementById('sbdInput');
    const resultBox = document.getElementById('resultBox');
    const sbdValue = sbdInput.value.trim();
    
	// 1. Kiểm tra xem người dùng đã nhập SBD chưa
    if (!sbdValue) {
        resultBox.className = "result-box result-error";
        resultBox.style.display = "block";
        resultBox.innerHTML = "Vui lòng nhập số báo danh!";
        return;
    }

    // 2. Tìm học sinh theo Số báo danh (không phân biệt chữ hoa/thường)
    const student = csvData.find(item => item.sbd && item.sbd.toString().toLowerCase() === sbdValue.toLowerCase());

    if (student) {
        // Lấy giá trị kết quả trong file CSV (ví dụ: "Trúng tuyển" hoặc "Không trúng tuyển")
        const dynamicResult = student.ketqua ? student.ketqua.toString().trim() : "";
        const checkText = dynamicResult.toLowerCase();
        
        let statusHTML = "";

        // Kiểm tra xem chữ trong file CSV có chứa từ "không" (hoặc "khong") hay không
        if (checkText.includes("không") || checkText.includes("khong")) {
            statusHTML = `<span class="status-fail">❌ ${dynamicResult.toUpperCase()}</span>`;
        } else {
            statusHTML = `<span class="status-pass">🎉 ${dynamicResult.toUpperCase()}</span>`;
        }

        // Tạo khung thông tin chia làm các dòng gạch ngang mảnh giống hệt ảnh mẫu của bạn
        resultBox.className = "result-box"; 
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <div class="result-card-detail">
                <div class="result-row">
                    <div class="result-label">Số báo danh</div>
                    <div class="result-value">${student.sbd}</div>
                </div>
                <div class="result-row">
                    <div class="result-label">Kết quả tuyển sinh</div>
                    <div class="result-value">${statusHTML}</div>
                </div>
            </div>
        `;
    } else {
        // Không tìm thấy kết quả
        resultBox.className = "result-box result-error";
        resultBox.style.display = "block";
        resultBox.innerHTML = `Không tìm thấy kết quả cho SBD: <b>${sbdValue}</b>`;
    }
}