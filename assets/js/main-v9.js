console.log("Synapse frontend ready.");

// Масштабирование canvas под реальную ширину экрана на мобильных
function scaleCanvasForMobile() {
  var canvas = document.querySelector('.canvas');
  if (!canvas) return;
  
  var viewportWidth = window.innerWidth;
  var designWidth = 375; // Ширина макета для мобильного
  var mobileBreakpoint = 375; // Третье медиа
  
  if (viewportWidth <= mobileBreakpoint) {
    // Экран уже 375px — масштабируем canvas
    var scale = viewportWidth / designWidth;
    canvas.style.transform = 'scale(' + scale + ')';
    canvas.style.transformOrigin = 'top center';
    canvas.style.width = designWidth + 'px';
    // Корректируем высоту wrapper для правильного скролла
    var canvasHeight = canvas.scrollHeight || canvas.offsetHeight;
    document.body.style.minHeight = (canvasHeight * scale) + 'px';
  } else {
    // Сбрасываем масштабирование
    canvas.style.transform = '';
    canvas.style.transformOrigin = '';
    document.body.style.minHeight = '';
  }
}

// Запускаем при загрузке и ресайзе
window.addEventListener('load', scaleCanvasForMobile);
window.addEventListener('resize', scaleCanvasForMobile);
// Также при изменении ориентации
window.addEventListener('orientationchange', function() {
  setTimeout(scaleCanvasForMobile, 100);
});

// Маска телефона: цифры автоматически раскладываются по шаблону _-___-___-__-__
document.addEventListener("DOMContentLoaded", function () {
  // Первичное масштабирование
  scaleCanvasForMobile();
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

  // Динамическое обновление высоты lead-block на основе высоты lead-form
  function updateLeadBlockHeight() {
    var leadBlock = document.querySelector('.lead-block');
    var leadForm = document.querySelector('.lead-form');
    var canvas = document.querySelector('.canvas');
    
    if (!leadBlock || !leadForm) return;

    // Получаем позицию формы относительно блока
    var formTop = parseInt(window.getComputedStyle(leadForm).top) || 0;
    
    // Получаем реальную высоту формы (включая iframe внутри)
    var formHeight = leadForm.scrollHeight;
    
    // Вычисляем минимальную высоту блока: позиция формы + высота формы + отступ снизу
    var calculatedHeight = formTop + formHeight + 50;
    
    // Минимальная высота из CSS переменной (базовое значение)
    var baseMinHeight = 650;
    
    // Используем большее значение: либо вычисленное, либо базовое минимальное
    var minBlockHeight = Math.max(calculatedHeight, baseMinHeight);
    
    // Обновляем высоту блока (в обе стороны - увеличиваем и уменьшаем)
    leadBlock.style.minHeight = minBlockHeight + 'px';
    
    // Обновляем CSS переменную для использования в calc() для футера
    document.documentElement.style.setProperty('--lead-block-height', minBlockHeight + 'px');
    
    // Обновляем высоту canvas
    if (canvas) {
      var leadBlockTop = parseInt(window.getComputedStyle(leadBlock).top) || 0;
      var leadBlockBottom = leadBlockTop + minBlockHeight;
      var footer = document.querySelector('.info-block') || document.querySelector('.site-footer');
      
      if (footer) {
        var footerHeight = footer.offsetHeight || 200;
        var canvasMinHeight = leadBlockBottom + footerHeight + 100;
        
        // Получаем базовую минимальную высоту canvas из CSS переменной
        var baseCanvasHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--canvas-height')) || 0;
        
        // Используем большее значение
        var finalCanvasHeight = Math.max(canvasMinHeight, baseCanvasHeight);
        canvas.style.minHeight = finalCanvasHeight + 'px';
      }
    }
  }

  // Отслеживаем изменения размера формы
  var resizeObserver = new ResizeObserver(function(entries) {
    updateLeadBlockHeight();
  });

  var leadForm = document.querySelector('.lead-form');
  if (leadForm) {
    resizeObserver.observe(leadForm);
    
    // Также отслеживаем изменения iframe внутри формы
    var iframe = leadForm.querySelector('iframe');
    if (iframe) {
      // Отслеживаем загрузку iframe
      iframe.addEventListener('load', function() {
        setTimeout(updateLeadBlockHeight, 100);
      });
      
      // Периодически проверяем высоту iframe (так как он может менять размер динамически)
      setInterval(function() {
        if (iframe.contentWindow) {
          try {
            var iframeHeight = iframe.contentWindow.document.body.scrollHeight;
            if (iframeHeight > 0) {
              iframe.style.height = iframeHeight + 'px';
              updateLeadBlockHeight();
            }
          } catch (e) {
            // Игнорируем ошибки кросс-доменных iframe
          }
        }
      }, 500);
    }
  }

  // Первоначальное обновление
  setTimeout(updateLeadBlockHeight, 100);
  setTimeout(updateLeadBlockHeight, 1000); // Повторная проверка после загрузки iframe
});
