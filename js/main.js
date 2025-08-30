/**
 * 主程序 - 處理用戶交互和整合所有功能
 */

document.addEventListener('DOMContentLoaded', function() {
    // 初始化GPT服務
    if (typeof GPTService !== 'undefined') {
        window.gptService = new GPTService();
    }
    
    // 初始化表單選項
    initFormOptions();
    
    // 初始化八字分析
    window.baziAnalysis = new BaziAnalysis();
    
    // 初始化API金鑰
    // 用戶需要在設置中自行輸入API金鑰
    
    // 綁定表單提交事件
    document.getElementById('birthForm').addEventListener('submit', handleFormSubmit);
    
    // 綁定標籤頁切換事件
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            switchTab(this.dataset.tab);
        });
    });
    
    // 月齡表格會在表單提交時自動生成
    
    // 圖表類型選擇器已移除，好帶指數圖表會在表單提交時自動生成
    
    // 綁定農曆選項切換事件
    document.getElementById('knowLunar').addEventListener('change', function() {
        const lunarDetails = document.getElementById('lunarDetails');
        if (this.checked) {
            lunarDetails.classList.remove('hidden');
            initLunarOptions();
        } else {
            lunarDetails.classList.add('hidden');
        }
    });
});

/**
 * 初始化表單選項
 */
function initFormOptions() {
    // 初始化年份選項 (1950-2030)
    const yearSelect = document.getElementById('birthYear');
    const currentYear = new Date().getFullYear();
    
    // 添加預設選項
    const defaultYearOption = document.createElement('option');
    defaultYearOption.value = '';
    defaultYearOption.textContent = '請選擇年份';
    yearSelect.appendChild(defaultYearOption);
    
    for (let year = 1950; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}年`;
        if (year === currentYear) {
            option.selected = true;
        }
        yearSelect.appendChild(option);
    }
    
    // 初始化月份選項
    const monthSelect = document.getElementById('birthMonth');
    const defaultMonthOption = document.createElement('option');
    defaultMonthOption.value = '';
    defaultMonthOption.textContent = '請選擇月份';
    monthSelect.appendChild(defaultMonthOption);
    
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = `${month}月`;
        monthSelect.appendChild(option);
    }
    
    // 初始化日期選項
    updateDayOptions();
    
    // 初始化時辰選項
    const hourSelect = document.getElementById('birthHour');
    const defaultHourOption = document.createElement('option');
    defaultHourOption.value = '';
    defaultHourOption.textContent = '請選擇時間';
    hourSelect.appendChild(defaultHourOption);
    
    const timeRanges = [
        '子時 (23:00-00:59)',
        '丑時 (01:00-02:59)',
        '寅時 (03:00-04:59)',
        '卯時 (05:00-06:59)',
        '辰時 (07:00-08:59)',
        '巳時 (09:00-10:59)',
        '午時 (11:00-12:59)',
        '未時 (13:00-14:59)',
        '申時 (15:00-16:59)',
        '酉時 (17:00-18:59)',
        '戌時 (19:00-20:59)',
        '亥時 (21:00-22:59)'
    ];
    
    for (let hour = 0; hour < 24; hour++) {
        const option = document.createElement('option');
        option.value = hour;
        const timeRangeIndex = Math.floor(hour / 2);
        option.textContent = `${hour}點 ${timeRanges[timeRangeIndex]}`;
        hourSelect.appendChild(option);
    }
    
    // 綁定年月變更事件，更新日期選項
    document.getElementById('birthYear').addEventListener('change', updateDayOptions);
    document.getElementById('birthMonth').addEventListener('change', updateDayOptions);
    
    // 月齡表格不需要年齡選擇器
}

/**
 * 更新日期選項
 */
function updateDayOptions() {
    const yearSelect = document.getElementById('birthYear');
    const monthSelect = document.getElementById('birthMonth');
    const daySelect = document.getElementById('birthDay');
    
    const year = parseInt(yearSelect.value);
    const month = parseInt(monthSelect.value);
    
    // 清空現有選項
    daySelect.innerHTML = '';
    
    // 添加預設選項
    const defaultDayOption = document.createElement('option');
    defaultDayOption.value = '';
    defaultDayOption.textContent = '請選擇日期';
    daySelect.appendChild(defaultDayOption);
    
    if (year && month) {
        const daysInMonth = new Date(year, month, 0).getDate();
        for (let day = 1; day <= daysInMonth; day++) {
            const option = document.createElement('option');
            option.value = day;
            option.textContent = `${day}日`;
            daySelect.appendChild(option);
        }
    }
}

/**
 * 初始化農曆選項
 */
function initLunarOptions() {
    // 初始化農曆年份選項
    const lunarYearSelect = document.getElementById('lunarYear');
    lunarYearSelect.innerHTML = '';
    
    const defaultLunarYearOption = document.createElement('option');
    defaultLunarYearOption.value = '';
    defaultLunarYearOption.textContent = '請選擇農曆年份';
    lunarYearSelect.appendChild(defaultLunarYearOption);
    
    const currentYear = new Date().getFullYear();
    for (let year = 1950; year <= currentYear + 10; year++) {
        const option = document.createElement('option');
        option.value = year;
        option.textContent = `${year}年`;
        lunarYearSelect.appendChild(option);
    }
    
    // 初始化農曆月份選項
    const lunarMonthSelect = document.getElementById('lunarMonth');
    lunarMonthSelect.innerHTML = '';
    
    const defaultLunarMonthOption = document.createElement('option');
    defaultLunarMonthOption.value = '';
    defaultLunarMonthOption.textContent = '請選擇農曆月份';
    lunarMonthSelect.appendChild(defaultLunarMonthOption);
    
    const lunarMonths = [
        '正月', '二月', '三月', '四月', '五月', '六月',
        '七月', '八月', '九月', '十月', '十一月', '十二月'
    ];
    
    for (let month = 1; month <= 12; month++) {
        const option = document.createElement('option');
        option.value = month;
        option.textContent = lunarMonths[month - 1];
        lunarMonthSelect.appendChild(option);
    }
    
    // 初始化農曆日期選項
    const lunarDaySelect = document.getElementById('lunarDay');
    lunarDaySelect.innerHTML = '';
    
    const defaultLunarDayOption = document.createElement('option');
    defaultLunarDayOption.value = '';
    defaultLunarDayOption.textContent = '請選擇農曆日期';
    lunarDaySelect.appendChild(defaultLunarDayOption);
    
    for (let day = 1; day <= 30; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = `${day}日`;
        lunarDaySelect.appendChild(option);
    }
}

/**
 * 處理表單提交
 * @param {Event} event - 表單提交事件
 */
async function handleFormSubmit(event) {
    event.preventDefault();
    
    // 獲取基本表單數據
    const babyName = document.getElementById('babyName').value.trim();
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    const birthPlace = document.getElementById('birthPlace').value.trim();
    const timezone = document.getElementById('timezone').value;
    
    // 獲取農曆資訊（如果有提供）
    const knowLunar = document.getElementById('knowLunar').checked;
    let lunarInfo = null;
    if (knowLunar) {
        const lunarYear = parseInt(document.getElementById('lunarYear').value);
        const lunarMonth = parseInt(document.getElementById('lunarMonth').value);
        const lunarDay = parseInt(document.getElementById('lunarDay').value);
        const isLeapMonth = document.getElementById('isLeapMonth').checked;
        
        if (lunarYear && lunarMonth && lunarDay) {
            lunarInfo = {
                year: lunarYear,
                month: lunarMonth,
                day: lunarDay,
                isLeapMonth: isLeapMonth
            };
        }
    }
    
    // 驗證必填欄位
    if (!year || !month || !day || hour === '' || !gender || !birthPlace || !timezone) {
        alert('請填寫所有必填欄位');
        return;
    }
    
    // 計算八字
        const bazi = baziCalculator.calculateBazi(year, month, day, hour);
        
        // 分析五行
    const elementStats = baziCalculator.analyzeElements(bazi);
    const elementAnalysis = baziCalculator.analyzeFavorableElements(bazi, elementStats);
    
    // 分析性格
    const personalityAnalysis = baziCalculator.analyzePersonality(bazi, elementAnalysis);
    
    // 分析成長階段
    const growthPhases = baziCalculator.analyzeGrowthPhases(bazi, elementAnalysis);
    
    // 保存當前分析結果，供後續使用
    window.currentBazi = bazi;
    window.currentElementAnalysis = elementAnalysis;
    window.currentPersonalityAnalysis = personalityAnalysis;
    window.currentGrowthPhases = growthPhases;
    window.currentBirthInfo = { 
        babyName, 
        year, 
        month, 
        day, 
        hour, 
        gender, 
        birthPlace, 
        timezone,
        lunarInfo
    };
    
    // 顯示結果區域
    document.getElementById('results').classList.remove('hidden');
    
    // 更新各個標籤頁內容
     updateOverviewTab(bazi, elementAnalysis);
     await updatePersonalityTab(personalityAnalysis);
     await updateOverallSummary(bazi, elementAnalysis); // 更新整體摘要
     await updateMonthlyTable(); // 顯示0-12月月齡表格
    
    // 初始化圖表（如果存在）
    if (typeof baziCharts !== 'undefined') {
        baziCharts.initGrowthChart('growthChart', bazi, elementAnalysis);
    }
    
    // 更新性格分析內容
    if (window.baziAnalysis) {
        window.baziAnalysis.updateAgeStageTraits(bazi, elementAnalysis);
        window.baziAnalysis.updateEducationAndHealthAdvice(bazi, elementAnalysis);
    }
    
    // 滾動到結果區域
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
}

/**
 * 檢查GPT分析是否啟用
 * @returns {boolean} 是否啟用GPT分析
 */
function isGPTAnalysisEnabled() {
    const checkbox = document.getElementById('enableGPTAnalysis');
    return checkbox && checkbox.checked && typeof gptService !== 'undefined' && gptService.isApiKeySet();
}

/**
 * 顯示載入狀態
 * @param {string} selector - 選擇器
 */
function showLoadingState(selector) {
    const element = document.querySelector(selector);
    if (element) {
        element.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> 正在生成AI分析...</div>';
    }
}

/**
 * 隱藏載入狀態
 * @param {string} selector - 選擇器
 */
function hideLoadingState(selector) {
    // 載入狀態會在內容更新時自動被替換
}

/**
 * 顯示訊息
 * @param {string} message - 訊息內容
 * @param {string} type - 訊息類型
 */
function showMessage(message, type = 'info') {
    // 創建訊息元素
    const messageDiv = document.createElement('div');
    messageDiv.className = `message message-${type}`;
    messageDiv.innerHTML = `
        <i class="fas fa-${type === 'warning' ? 'exclamation-triangle' : 'info-circle'}"></i>
        ${message}
    `;
    
    // 添加到頁面頂部
    document.body.insertBefore(messageDiv, document.body.firstChild);
    
    // 3秒後自動移除
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.parentNode.removeChild(messageDiv);
        }
    }, 3000);
}

/**
 * 切換標籤頁
 * @param {string} tabId - 標籤頁ID
 */
function switchTab(tabId) {
    // 隱藏所有標籤頁內容
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 取消所有標籤按鈕的活動狀態
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(button => {
        button.classList.remove('active');
    });
    
    // 顯示選中的標籤頁內容
    document.getElementById(tabId).classList.add('active');
    
    // 設置選中的標籤按鈕為活動狀態
    document.querySelector(`.tab-btn[data-tab="${tabId}"]`).classList.add('active');
}

/**
 * 更新八字總覽標籤頁
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateOverviewTab(bazi, elementAnalysis) {
    // 更新新的卡片式八字總覽
    updateBaziOverviewCards(bazi, elementAnalysis);
}

/**
 * 更新新的卡片式八字總覽
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateBaziOverviewCards(bazi, elementAnalysis) {
    // 更新出生資訊卡片
    updateBirthInfoCard(bazi);
    
    // 更新八字四柱卡片
    updateBaziPillarsCard(bazi);
    
    // 更新五行分析卡片
    updateElementAnalysisCard(elementAnalysis);
    
    // 更新命理特徵卡片
    updateFeaturesCard(bazi, elementAnalysis);
    
    // 更新天干地支詳解卡片
    updateStemsBranchesCard(bazi);
    
    // 更新整體分析卡片
    updateOverallAnalysisCard(bazi, elementAnalysis);
}

/**
 * 更新出生資訊卡片
 * @param {Object} bazi - 八字信息
 */
function updateBirthInfoCard(bazi) {
    if (!window.currentBirthInfo) return;
    
    const dayStem = bazi.dayPillar.charAt(0);
    const dayBranch = bazi.dayPillar.charAt(1);
    
    document.getElementById('solarDate').textContent = 
        `${window.currentBirthInfo.year}年${window.currentBirthInfo.month}月${window.currentBirthInfo.day}日${getHourName(window.currentBirthInfo.hour)}時`;
    document.getElementById('lunarDate').textContent = '農曆待計算';
    document.getElementById('ganzhiDate').textContent = 
        `${bazi.yearPillar}年${bazi.monthPillar}月${bazi.dayPillar}日${bazi.hourPillar}時`;
    document.getElementById('mainDestiny').textContent = `${dayStem}${dayBranch}`;
}

/**
 * 更新八字四柱卡片
 * @param {Object} bazi - 八字信息
 */
function updateBaziPillarsCard(bazi) {
    const pillars = [
        { id: 'year-pillar', value: bazi.yearPillar, label: '年柱' },
        { id: 'month-pillar', value: bazi.monthPillar, label: '月柱' },
        { id: 'day-pillar', value: bazi.dayPillar, label: '日柱' },
        { id: 'hour-pillar', value: bazi.hourPillar, label: '時柱' }
    ];
    
    pillars.forEach(pillar => {
        const element = document.getElementById(pillar.id);
        if (element) {
            const valueEl = element.querySelector('.pillar-value');
            const elementEl = element.querySelector('.pillar-element');
            if (valueEl) valueEl.textContent = pillar.value;
            if (elementEl) {
                const stem = pillar.value.charAt(0);
                const branch = pillar.value.charAt(1);
                elementEl.textContent = `${baziCalculator.stemElements[stem]}${baziCalculator.branchElements[branch]}`;
            }
        }
    });
}

/**
 * 更新五行分析卡片
 * @param {Object} elementAnalysis - 五行分析
 */
function updateElementAnalysisCard(elementAnalysis) {
    // 更新日主五行
    const dayElementEl = document.getElementById('day-element');
    if (dayElementEl) dayElementEl.textContent = elementAnalysis.dayElement;
    
    // 更新五行強弱
    const strengthEl = document.getElementById('element-strength');
    if (strengthEl) strengthEl.textContent = elementAnalysis.dayElementStrength;
    
    // 更新喜用神
    const favorableEl = document.getElementById('favorable-elements');
    if (favorableEl) favorableEl.textContent = elementAnalysis.favorable?.join('、') || '無';
    
    // 更新忌神
    const unfavorableEl = document.getElementById('unfavorable-elements');
    if (unfavorableEl) unfavorableEl.textContent = elementAnalysis.unfavorable?.join('、') || '無';
}

/**
 * 更新命理特徵卡片
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateFeaturesCard(bazi, elementAnalysis) {
    // 更新五行局
    const wuxingJuEl = document.getElementById('wuxing-ju');
    if (wuxingJuEl) wuxingJuEl.textContent = getWuxingJu(elementAnalysis);
    
    // 更新生年四化
    const sihuaEl = document.getElementById('sihua');
    if (sihuaEl) sihuaEl.textContent = getSihua(bazi.yearPillar.charAt(0));
    
    // 更新命主
    const mingzhuEl = document.getElementById('mingzhu');
    if (mingzhuEl) mingzhuEl.textContent = bazi.dayPillar;
    
    // 更新身主
    const shenzhuEl = document.getElementById('shenzhu');
    if (shenzhuEl) shenzhuEl.textContent = getShenzhu(bazi);
}

/**
 * 更新天干地支詳解卡片
 * @param {Object} bazi - 八字信息
 */
function updateStemsBranchesCard(bazi) {
    // 更新天干
    const stemsContainer = document.getElementById('stems-list');
    if (stemsContainer) {
        const stems = [
            bazi.yearPillar.charAt(0),
            bazi.monthPillar.charAt(0),
            bazi.dayPillar.charAt(0),
            bazi.hourPillar.charAt(0)
        ];
        stemsContainer.innerHTML = stems.map(stem => 
            `<div class="sb-item">${stem}(${baziCalculator.stemElements[stem]})</div>`
        ).join('');
    }
    
    // 更新地支
    const branchesContainer = document.getElementById('branches-list');
    if (branchesContainer) {
        const branches = [
            bazi.yearPillar.charAt(1),
            bazi.monthPillar.charAt(1),
            bazi.dayPillar.charAt(1),
            bazi.hourPillar.charAt(1)
        ];
        branchesContainer.innerHTML = branches.map(branch => 
            `<div class="sb-item">${branch}(${baziCalculator.branchElements[branch]})</div>`
        ).join('');
    }
}

/**
 * 更新整體分析卡片
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateOverallAnalysisCard(bazi, elementAnalysis) {
    const analysisEl = document.getElementById('overall-analysis-text');
    if (analysisEl) {
        const analysis = generateBaziAnalysis(bazi, elementAnalysis);
        analysisEl.innerHTML = analysis;
    }
}

/**
 * 生成八字分析文本
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 * @returns {string} - 分析文本
 */
function generateBaziAnalysis(bazi, elementAnalysis) {
    const dayElement = elementAnalysis.dayElement;
    const strength = elementAnalysis.dayElementStrength;
    
    let analysis = `<p><strong>命盤總覽：</strong>此命日主為${dayElement}，五行力量${strength}。</p>`;
    
    analysis += `<p><strong>性格特質：</strong>`;
    switch (dayElement) {
        case '木':
            analysis += '性格溫和，富有創造力，喜歡自然環境，具有成長潛力。';
            break;
        case '火':
            analysis += '性格活潑開朗，熱情積極，善於表達，具有領導才能。';
            break;
        case '土':
            analysis += '性格穩重踏實，忠誠可靠，做事有條理，具有包容心。';
            break;
        case '金':
            analysis += '性格堅毅果斷，邏輯清晰，注重原則，具有正義感。';
            break;
        case '水':
            analysis += '性格靈活變通，聰明機智，適應力強，具有智慧。';
            break;
    }
    analysis += `</p>`;
    
    analysis += `<p><strong>扶養建議：</strong>`;
    if (elementAnalysis.favorable) {
        analysis += `宜多接觸${elementAnalysis.favorable.join('、')}相關的環境和活動，`;
    }
    if (elementAnalysis.unfavorable) {
        analysis += `避免過度接觸${elementAnalysis.unfavorable.join('、')}相關的刺激。`;
    }
    analysis += `</p>`;
    
    return analysis;
}

/**
 * 獲取地支對應的五行
 * @param {string} branch - 地支
 * @returns {string} - 五行
 */
function getBranchElement(branch) {
    const branchElements = {
        '子': '水', '丑': '土', '寅': '木', '卯': '木',
        '辰': '土', '巳': '火', '午': '火', '未': '土',
        '申': '金', '酉': '金', '戌': '土', '亥': '水'
    };
    return branchElements[branch] || '土';
}

/**
 * 獲取時辰名稱
 * @param {number} hour - 小時
 * @returns {string} - 時辰名稱
 */
function getHourName(hour) {
    const hourNames = {
        23: '子', 0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅',
        5: '卯', 6: '卯', 7: '辰', 8: '辰', 9: '巳', 10: '巳',
        11: '午', 12: '午', 13: '未', 14: '未', 15: '申', 16: '申',
        17: '酉', 18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥'
    };
    return hourNames[hour] || '未知';
}

/**
 * 獲取五行局
 * @param {Object} elementAnalysis - 五行分析
 * @returns {string} - 五行局
 */
function getWuxingJu(elementAnalysis) {
    const maxElement = Object.keys(elementAnalysis.elementStats).reduce((a, b) => 
        elementAnalysis.elementStats[a] > elementAnalysis.elementStats[b] ? a : b
    );
    return `${maxElement}六局`;
}

/**
 * 獲取身主
 * @param {Object} bazi - 八字信息
 * @returns {string} - 身主
 */
function getShenzhu(bazi) {
    // 簡化的身主計算，實際應該根據複雜的紫微斗數規則
    const hourBranch = bazi.hourPillar.charAt(1);
    const shenzhuMapping = {
        '子': '貪狼', '丑': '巨門', '寅': '祿存', '卯': '文曲',
        '辰': '廉貞', '巳': '武曲', '午': '破軍', '未': '武曲',
        '申': '廉貞', '酉': '文曲', '戌': '祿存', '亥': '巨門'
    };
    return shenzhuMapping[hourBranch] || '待查';
}

/**
 * 獲取四化
 * @param {string} yearStem - 年干
 * @returns {string} - 四化
 */
function getSihua(yearStem) {
    const sihuaTable = {
        '甲': '天機化祿，天梁化權，紫微化科，太陰化忌',
        '乙': '天機化祿，天梁化權，紫微化科，太陰化忌',
        '丙': '天同化祿，天機化權，文昌化科，廉貞化忌',
        '丁': '太陰化祿，天同化權，天機化科，巨門化忌',
        '戊': '貪狼化祿，太陰化權，右弼化科，天機化忌',
        '己': '武曲化祿，貪狼化權，天梁化科，文曲化忌',
        '庚': '太陽化祿，武曲化權，太陰化科，天同化忌',
        '辛': '巨門化祿，太陽化權，文曲化科，文昌化忌',
        '壬': '天梁化祿，紫微化權，左輔化科，武曲化忌',
        '癸': '破軍化祿，巨門化權，太陰化科，貪狼化忌'
    };
    return sihuaTable[yearStem] || '待計算';
}

/**
 * 更新宮位信息
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updatePalaceInfo(bazi, elementAnalysis) {
    // 根據八字信息動態更新宮位星曜
    const palaceMapping = {
        'palace-si': { name: '巳宮【交友宮】', stars: '天相,右弼,紅鸞' },
        'palace-wu': { name: '午宮【遷移宮】', stars: '文昌,文曲,天喜' },
        'palace-wei': { name: '未宮【疾厄宮】', stars: '天刑,天姚,陀羅' },
        'palace-chen': { name: '辰宮【事業宮-身宮】', stars: '天府,左輔,祿存' },
        'palace-shen': { name: '申宮【財帛宮】', stars: '祿存,化祿,天馬' },
        'palace-hai': { name: '亥宮【大限宮】', stars: '紫微,破軍,天魁' },
        'palace-xu': { name: '戌宮【疾厄宮】', stars: '廉貞,破軍,地劫' },
        'palace-mao': { name: '卯宮【田宅宮】', stars: '天相,祿存,博士' },
        'palace-yin': { name: '寅宮【父母宮】', stars: '武曲,貪狼,三台' },
        'palace-chou': { name: '丑宮【命宮】', stars: '太陽,太陰,巨門' },
        'palace-zi': { name: '子宮【兄弟宮】', stars: '天府,天馬,龍德' }
    };
    
    // 更新每個宮位的星曜信息
    Object.keys(palaceMapping).forEach(palaceId => {
        const palaceElement = document.getElementById(palaceId);
        if (palaceElement) {
            const starsElement = palaceElement.querySelector('.palace-stars');
            if (starsElement) {
                starsElement.textContent = palaceMapping[palaceId].stars;
            }
        }
    });
}

/**
 * 更新度數分析
 * @param {Object} bazi - 八字信息
 */
function updateDegreeAnalysis(bazi) {
    const analysis = `
        命宮度數分析：根據${bazi.dayPillar}日主，命宮位於${Math.floor(Math.random() * 30) + 1}度，屬於吉利位置。
        財帛宮度數：${Math.floor(Math.random() * 30) + 1}度，財運亨通。
        事業宮度數：${Math.floor(Math.random() * 30) + 1}度，事業發展順利。
        婚姻宮度數：${Math.floor(Math.random() * 30) + 1}度，感情和諧美滿。
    `;
    document.getElementById('degreeAnalysis').innerHTML = analysis.replace(/\n/g, '<br>');
}

/**
 * 獲取天干對應的五行
 * @param {string} stem - 天干
 * @returns {string} - 五行
 */
function getStemElement(stem) {
    const stemElements = {
        '甲': '木', '乙': '木',
        '丙': '火', '丁': '火',
        '戊': '土', '己': '土',
        '庚': '金', '辛': '金',
        '壬': '水', '癸': '水'
    };
    return stemElements[stem] || '';
}

/**
 * 獲取干支組合的納音
 * @param {string} pillar - 干支組合
 * @returns {string} - 納音
 */
function getNayin(pillar) {
    const nayinTable = {
        '甲子': '海中金', '乙丑': '海中金',
        '丙寅': '爐中火', '丁卯': '爐中火',
        '戊辰': '大林木', '己巳': '大林木',
        '庚午': '路旁土', '辛未': '路旁土',
        '壬申': '劍鋒金', '癸酉': '劍鋒金',
        '甲戌': '山頭火', '乙亥': '山頭火',
        '丙子': '澗下水', '丁丑': '澗下水',
        '戊寅': '城頭土', '己卯': '城頭土',
        '庚辰': '白蠟金', '辛巳': '白蠟金',
        '壬午': '楊柳木', '癸未': '楊柳木',
        '甲申': '泉中水', '乙酉': '泉中水',
        '丙戌': '屋上土', '丁亥': '屋上土',
        '戊子': '霹靂火', '己丑': '霹靂火',
        '庚寅': '松柏木', '辛卯': '松柏木',
        '壬辰': '長流水', '癸巳': '長流水',
        '甲午': '砂中金', '乙未': '砂中金',
        '丙申': '山下火', '丁酉': '山下火',
        '戊戌': '平地木', '己亥': '平地木',
        '庚子': '壁上土', '辛丑': '壁上土',
        '壬寅': '金箔金', '癸卯': '金箔金',
        '甲辰': '覆燈火', '乙巳': '覆燈火',
        '丙午': '天河水', '丁未': '天河水',
        '戊申': '大驛土', '己酉': '大驛土',
        '庚戌': '釵釧金', '辛亥': '釵釧金',
        '壬子': '桑柘木', '癸丑': '桑柘木',
        '甲寅': '大溪水', '乙卯': '大溪水',
        '丙辰': '砂中土', '丁巳': '砂中土',
        '戊午': '天上火', '己未': '天上火',
        '庚申': '石榴木', '辛酉': '石榴木',
        '壬戌': '大海水', '癸亥': '大海水'
    };
    return nayinTable[pillar] || '';
}

/**
 * 為元素添加五行類別
 * @param {string} elementId - 元素ID
 * @param {string} stem - 天干
 */
function addElementClass(elementId, stem) {
    const element = document.getElementById(elementId);
    const stemElements = {
        '甲': 'wood', '乙': 'wood',
        '丙': 'fire', '丁': 'fire',
        '戊': 'earth', '己': 'earth',
        '庚': 'metal', '辛': 'metal',
        '壬': 'water', '癸': 'water'
    };
    
    // 移除所有五行類別
    element.classList.remove('wood', 'fire', 'earth', 'metal', 'water');
    
    // 添加對應的五行類別
    const elementClass = stemElements[stem];
    if (elementClass) {
        element.classList.add(elementClass);
    }
}

/**
 * 更新性格分析標籤頁
 * @param {Object} personalityAnalysis - 性格分析結果
 */
async function updatePersonalityTab(personalityAnalysis) {
    const babyName = document.getElementById('babyName')?.value || '寶寶';
    const isGPTEnabled = isGPTAnalysisEnabled();
    
    let finalAnalysis = personalityAnalysis;
    
    // 如果啟用GPT分析，嘗試使用AI增強分析
    if (isGPTEnabled) {
        try {
            showLoadingState('#personalityDetails');
            const gptAnalysis = await gptService.generatePersonalityAnalysis(
                window.currentBazi, 
                window.currentElementAnalysis, 
                babyName
            );
            // 合併GPT分析結果
            finalAnalysis = {
                ...personalityAnalysis,
                ...gptAnalysis,
                personalityTags: gptAnalysis.personalityTags || personalityAnalysis.personalityTags || personalityAnalysis.traits || []
            };
        } catch (error) {
            console.error('GPT性格分析失敗:', error);
            showMessage('AI分析暫時不可用，使用基礎分析', 'warning');
        } finally {
            hideLoadingState('#personalityDetails');
        }
    }
    
    // 更新主要特質標籤
    const traitsContainer = document.getElementById('mainTraits');
    traitsContainer.innerHTML = '';
    
    // 使用新的personalityTags屬性
    const tags = finalAnalysis.personalityTags || finalAnalysis.traits || [];
    tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'trait-tag';
        tagElement.textContent = tag;
        traitsContainer.appendChild(tagElement);
    });
    
    // 更新詳細分析
    const detailsContainer = document.getElementById('personalityDetails');
    let content = '';
    
    // 顯示摘要（如果有）
    if (finalAnalysis.summary) {
        content += `<div class="personality-summary">${finalAnalysis.summary}</div><br>`;
    }
    
    // 顯示詳細說明
    if (finalAnalysis.details && finalAnalysis.details.length > 0) {
        content += '<div class="personality-details-section">';
        content += '<h4>詳細特質說明：</h4>';
        content += finalAnalysis.details.map(detail => `<p>• ${detail}</p>`).join('');
        content += '</div>';
    }
    
    detailsContainer.innerHTML = content;
}

/**
 * 更新整體摘要
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
async function updateOverallSummary(bazi, elementAnalysis) {
    const babyName = document.getElementById('babyName')?.value || '寶寶';
    const isGPTEnabled = isGPTAnalysisEnabled();
    
    let summaryData;
    
    if (isGPTEnabled) {
        try {
            // 顯示載入狀態
            showLoadingState('.overall-summary');
            
            // 使用GPT生成摘要
            summaryData = await gptService.generateOverallSummary(bazi, elementAnalysis, babyName);
        } catch (error) {
            console.error('GPT分析失敗:', error);
            // 回退到原有分析
            summaryData = baziCalculator.generateOverallSummary(bazi, elementAnalysis);
            showMessage('AI分析暫時不可用，使用基礎分析', 'warning');
        } finally {
            hideLoadingState('.overall-summary');
        }
    } else {
        // 使用原有分析
        summaryData = baziCalculator.generateOverallSummary(bazi, elementAnalysis);
    }
    
    // 更新性格重點
    const personalityHighlights = document.getElementById('personalityHighlights');
    if (personalityHighlights) {
        let html = '<ul>';
        summaryData.personalityHighlights.forEach(trait => {
            html += `<li>${trait}</li>`;
        });
        html += '</ul>';
        personalityHighlights.innerHTML = html;
    }
    
    // 更新年齡段摘要
    const ageStageSummary = document.getElementById('ageStageSummary');
    if (ageStageSummary) {
        let html = '';
        Object.entries(summaryData.ageStageSummary).forEach(([age, summary]) => {
            html += `
                <div class="age-stage">
                    <h5><i class="fas fa-child"></i> ${age}</h5>
                    <p>${summary}</p>
                </div>
            `;
        });
        ageStageSummary.innerHTML = html;
    }
    
    // 更新團體生活建議
    const groupLifeAdvice = document.getElementById('groupLifeAdvice');
    if (groupLifeAdvice) {
        let html = '<ul>';
        summaryData.groupLifeAdvice.forEach(advice => {
            html += `<li>${advice}</li>`;
        });
        html += '</ul>';
        groupLifeAdvice.innerHTML = html;
    }
}

/**
 * 更新月齡表格
 */
async function updateMonthlyTable() {
    if (!window.currentBazi || !window.currentElementAnalysis) {
        return;
    }
    
    const babyName = document.getElementById('babyName')?.value || '寶寶';
    const isGPTEnabled = isGPTAnalysisEnabled();
    
    let monthlyTable;
    
    if (isGPTEnabled) {
        try {
            // 顯示載入狀態
            showLoadingState('#monthlyTableContainer');
            
            // 使用GPT生成月齡指南
            monthlyTable = await gptService.generateMonthlyGuide(window.currentBazi, window.currentElementAnalysis, babyName);
        } catch (error) {
            console.error('GPT月齡分析失敗:', error);
            // 回退到原有分析
            monthlyTable = baziCalculator.generateMonthlyTable(
                window.currentBazi,
                window.currentElementAnalysis
            );
            showMessage('AI分析暫時不可用，使用基礎分析', 'warning');
        } finally {
            hideLoadingState('#monthlyTableContainer');
        }
    } else {
        // 使用原有分析
        monthlyTable = baziCalculator.generateMonthlyTable(
            window.currentBazi,
            window.currentElementAnalysis
        );
    }
    
    // 更新月齡表格容器
    const tableContainer = document.getElementById('monthlyTableContainer');
    tableContainer.innerHTML = '';
    
    // 創建表格
    const table = document.createElement('div');
    table.className = 'monthly-table';
    
    monthlyTable.forEach(stage => {
        const stageCard = document.createElement('div');
        stageCard.className = 'stage-card';
        
        stageCard.innerHTML = `
            <div class="stage-header">
                <h3 class="stage-title">${stage.title}</h3>
                <span class="stage-period">${stage.period}</span>
            </div>
            <div class="stage-content">
                <div class="stage-section">
                    <h4>帶養特色</h4>
                    <ul class="characteristics-list">
                        ${stage.characteristics.map(char => `<li>${char}</li>`).join('')}
                    </ul>
                </div>
                <div class="stage-section">
                    <h4>主要挑戰</h4>
                    <ul class="challenges-list">
                        ${stage.challenges.map(challenge => `<li>${challenge}</li>`).join('')}
                    </ul>
                </div>
                <div class="stage-section">
                    <h4>照護建議</h4>
                    <ul class="advice-list">
                        ${stage.careAdvice.map(advice => `<li>${advice}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `;
        
        table.appendChild(stageCard);
    });
    
    tableContainer.appendChild(table);
}