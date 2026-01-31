console.log("Synapse frontend ready.");

// Маска телефона: цифры автоматически раскладываются по шаблону _-___-___-__-__
document.addEventListener("DOMContentLoaded", function () {
  var phoneInput = document.querySelector(".lead-phone-field input[type='tel']");
  if (!phoneInput) return;

  phoneInput.addEventListener("input", function (e) {
    var digits = e.target.value.replace(/\D/g, "").slice(0, 11); // максимум 11 цифр

    var parts = [];
    if (digits.length > 0) {
      parts.push(digits.slice(0, 1));
    }
    if (digits.length > 1) {
      parts.push(digits.slice(1, 4));
    }
    if (digits.length > 4) {
      parts.push(digits.slice(4, 7));
    }
    if (digits.length > 7) {
      parts.push(digits.slice(7, 9));
    }
    if (digits.length > 9) {
      parts.push(digits.slice(9, 11));
    }

    // Между блоками снова ставим обычный дефис
    e.target.value = parts.join("-");
  });
});
