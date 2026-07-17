document.addEventListener("DOMContentLoaded", () => {
    const btnSearch = document.getElementById("btnSearch");
    const sbdInput = document.getElementById("sbdInput");

    // Sự kiện khi click nút Tra cứu
    btnSearch.addEventListener("click", traCuuKetQua);

    // Sự kiện khi bấm nút Enter trên bàn phím
    sbdInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            traCuuKetQua();
        }
    });
});

function traCuuKetQua() {
    const sbdInput = document.getElementById('sbdInput');
    const resultBox = document.getElementById('resultBox');
    const sbdValue = sbdInput.value.trim();

    // Kiểm tra xem người dùng đã nhập SBD chưa
    if (!sbdValue) {
        resultBox.className = "result-box result-error";
        resultBox.style.display = "block";
        resultBox.innerHTML = "Vui lòng nhập số báo danh!";
        return;
    }

    // Đọc file kết quả dữ liệu ketqua.csv
    Papa.parse("ketqua.csv", {
        download: true,
        header: true,
        dynamicTyping: true,
        complete: function(results) {
            const data = results.data;
            // Tìm học sinh theo Số báo danh (không phân biệt chữ hoa/thường)
            const student = data.find(item => item.sbd && item.sbd.toString().toLowerCase() === sbdValue.toLowerCase());

            if (student) {
                resultBox.className = "result-box result-success";
                resultBox.style.display = "block";
                // Hiển thị 2 thông tin trên 2 dòng theo đúng yêu cầu
                resultBox.innerHTML = `
                    Số báo danh: <span class="result-text">${student.sbd}</span><br>
                    Kết quả: <span class="result-text">${student.ketqua}</span>
                `;
            } else {
                resultBox.className = "result-box result-error";
                resultBox.style.display = "block";
                resultBox.innerHTML = `Không tìm thấy kết quả cho SBD: <b>${sbdValue}</b>`;
            }
        },
        error: function() {
            resultBox.className = "result-box result-error";
            resultBox.style.display = "block";
            resultBox.innerHTML = "Không thể tải dữ liệu file CSV. Vui lòng kiểm tra lại file ketqua.csv!";
        }
    });
}