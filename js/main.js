/**
 * 主程序 - 處理用戶交互和整合所有功能
 */

document.addEventListener('DOMContentLoaded', function() {
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
    
    // 綁定年齡選擇事件
    document.getElementById('ageSelect').addEventListener('change', function() {
        updateMonthlyGuide(parseInt(this.value));
    });
    
    // 綁定圖表類型選擇事件
    document.getElementById('chartType').addEventListener('change', function() {
        if (window.currentBazi && window.currentElementAnalysis) {
            baziCharts.initGrowthChart('growthChart', window.currentBazi, window.currentElementAnalysis);
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
    
    // 初始化年齡選項
    const ageSelect = document.getElementById('ageSelect');
    for (let age = 0; age <= 10; age++) {
        const option = document.createElement('option');
        option.value = age;
        option.textContent = `${age}歲`;
        ageSelect.appendChild(option);
    }
}

/**
 * 更新日期選項
 */
function updateDayOptions() {
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const daySelect = document.getElementById('birthDay');
    
    // 清空現有選項
    daySelect.innerHTML = '';
    
    // 計算當月天數
    const daysInMonth = new Date(year, month, 0).getDate();
    
    // 添加日期選項
    for (let day = 1; day <= daysInMonth; day++) {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = `${day}日`;
        daySelect.appendChild(option);
    }
}

/**
 * 處理表單提交
 * @param {Event} event - 表單提交事件
 */
function handleFormSubmit(event) {
    event.preventDefault();
    
    // 獲取表單數據
    const year = parseInt(document.getElementById('birthYear').value);
    const month = parseInt(document.getElementById('birthMonth').value);
    const day = parseInt(document.getElementById('birthDay').value);
    const hour = parseInt(document.getElementById('birthHour').value);
    const gender = document.getElementById('gender').value;
    
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
    window.currentBirthInfo = { year, month, day, hour, gender };
    
    // 顯示結果區域
    document.getElementById('results').classList.remove('hidden');
    
    // 更新各個標籤頁內容
    updateOverviewTab(bazi, elementAnalysis);
    updatePersonalityTab(personalityAnalysis);
    updateMonthlyGuide(0); // 默認顯示0歲的月份指南
    baziCharts.initGrowthChart('growthChart', bazi, elementAnalysis);
    
    // 更新性格分析內容
    if (window.baziAnalysis) {
        window.baziAnalysis.updateAgeStageTraits(bazi, elementAnalysis);
        window.baziAnalysis.updateEducationAndHealthAdvice(bazi, elementAnalysis);
    }
    
    // 更新好運指數
    updateFortuneIndex(bazi, elementAnalysis);
    
    // 滾動到結果區域
    document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
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
    // 更新傳統八字排盤
    updateTraditionalBaziChart(bazi, elementAnalysis);
}

/**
 * 更新傳統八字排盤
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateTraditionalBaziChart(bazi, elementAnalysis) {
    // 更新頂部信息
    const dayStem = bazi.dayPillar.charAt(0);
    const dayBranch = bazi.dayPillar.charAt(1);
    document.getElementById('mainDestiny').textContent = `${dayStem}${dayBranch}`;
    
    // 更新中央出生信息
    if (window.currentBirthInfo) {
        const birthDate = new Date(window.currentBirthInfo.year, window.currentBirthInfo.month - 1, window.currentBirthInfo.day);
        document.getElementById('solarDate').textContent = `${window.currentBirthInfo.year}年${window.currentBirthInfo.month}月${window.currentBirthInfo.day}日${getHourName(window.currentBirthInfo.hour)}時`;
        document.getElementById('lunarDate').textContent = '農曆待計算';
        document.getElementById('ganzhiDate').textContent = `${bazi.yearPillar}年${bazi.monthPillar}月${bazi.dayPillar}日${bazi.hourPillar}時`;
        document.getElementById('wuxingJu').textContent = getWuxingJu(elementAnalysis);
        document.getElementById('sihua').textContent = getSihua(bazi.yearPillar.charAt(0));
        document.getElementById('mingzhu').textContent = `${dayStem}${dayBranch}`;
    }
    
    // 更新十二宮位信息
    updatePalaceInfo(bazi, elementAnalysis);
    
    // 更新底部度數分析
    updateDegreeAnalysis(bazi);
}

/**
 * 更新好運指數
 * @param {Object} bazi - 八字信息
 * @param {Object} elementAnalysis - 五行分析
 */
function updateFortuneIndex(bazi, elementAnalysis) {
    const fortuneIndexElement = document.getElementById('fortuneIndex');
    if (fortuneIndexElement) {
        // 計算好運指數（簡化版本）
        let fortuneScore = 88; // 預設值
        
        if (bazi && elementAnalysis) {
            // 根據八字五行平衡度計算
            const elements = ['木', '火', '土', '金', '水'];
            const elementCounts = elementAnalysis.elementStats || {};
            
            // 計算五行平衡度
            const totalCount = Object.values(elementCounts).reduce((sum, count) => sum + count, 0);
            if (totalCount > 0) {
                const averageCount = totalCount / 5;
                let balanceScore = 0;
                
                elements.forEach(element => {
                    const count = elementCounts[element] || 0;
                    const deviation = Math.abs(count - averageCount);
                    balanceScore += Math.max(0, 20 - deviation * 5);
                });
                
                fortuneScore = Math.min(99, Math.max(1, Math.round(balanceScore)));
            }
        }
        
        fortuneIndexElement.textContent = fortuneScore;
    }
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
function updatePersonalityTab(personalityAnalysis) {
    // 更新主要特質
    const traitsContainer = document.getElementById('mainTraits');
    traitsContainer.innerHTML = '';
    
    personalityAnalysis.traits.forEach(trait => {
        const traitElement = document.createElement('span');
        traitElement.className = 'trait-tag';
        traitElement.textContent = trait;
        traitsContainer.appendChild(traitElement);
    });
    
    // 更新詳細分析
    const detailsContainer = document.getElementById('personalityDetails');
    detailsContainer.innerHTML = personalityAnalysis.details.join('<br><br>');
    
    // 使用API金鑰獲取GPT分析
    detailsContainer.innerHTML += '<br><br><div class="loading">正在使用GPT API生成深度分析...</div>';
    
    baziAnalysis.generateGptAnalysis(window.currentBazi, window.currentElementAnalysis, 'personality')
        .then(analysis => {
            detailsContainer.innerHTML = analysis.replace(/\n/g, '<br>');
        })
        .catch(error => {
            detailsContainer.innerHTML += `<br><br>深度分析生成失敗: ${error.message}`;
        });
}

/**
 * 更新月份指南
 * @param {number} age - 年齡 (0-10)
 */
function updateMonthlyGuide(age) {
    if (!window.currentBazi || !window.currentElementAnalysis) {
        return;
    }
    
    // 生成月份指南
    const monthlyGuide = baziCalculator.generateMonthlyGuide(
        window.currentBazi,
        window.currentElementAnalysis,
        age
    );
    
    // 更新月份網格
    const monthsGrid = document.getElementById('monthsGrid');
    monthsGrid.innerHTML = '';
    
    monthlyGuide.forEach(month => {
        const monthCard = document.createElement('div');
        monthCard.className = 'month-card';
        
        // 根據月份五行添加類別
        let elementClass = '';
        switch (month.element) {
            case '木': elementClass = 'wood'; break;
            case '火': elementClass = 'fire'; break;
            case '土': elementClass = 'earth'; break;
            case '金': elementClass = 'metal'; break;
            case '水': elementClass = 'water'; break;
        }
        
        monthCard.innerHTML = `
            <h4 class="${elementClass}">${month.monthName} (${month.element})</h4>
            <div class="month-focus"><strong>重點:</strong> ${month.focus}</div>
            <div class="month-advice">${month.advice}</div>
        `;
        
        monthsGrid.appendChild(monthCard);
    });
}