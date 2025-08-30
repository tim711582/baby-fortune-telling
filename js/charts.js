/**
 * 圖表模組 - 用於視覺化展示八字分析結果
 */

class BaziCharts {
    constructor() {
        this.charts = {};
        this.colors = {
            wood: '#6ab04c',  // 木：綠色
            fire: '#eb4d4b',  // 火：紅色
            earth: '#f0932b', // 土：黃色
            metal: '#7ed6df', // 金：藍白色
            water: '#30336b'  // 水：深藍色
        };
    }

    /**
     * 初始化五行分布圖表
     * @param {string} canvasId - Canvas元素ID
     * @param {Object} elementStats - 五行統計數據
     */
    initElementsChart(canvasId, elementStats) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // 清除現有圖表
        if (this.charts.elements) {
            this.charts.elements.destroy();
        }
        
        // 轉換數據格式
        const labels = [];
        const data = [];
        const backgroundColors = [];
        
        for (const element in elementStats) {
            let englishElement;
            switch (element) {
                case '木': englishElement = 'wood'; break;
                case '火': englishElement = 'fire'; break;
                case '土': englishElement = 'earth'; break;
                case '金': englishElement = 'metal'; break;
                case '水': englishElement = 'water'; break;
                default: englishElement = 'other';
            }
            
            labels.push(element);
            data.push(elementStats[element]);
            backgroundColors.push(this.colors[englishElement]);
        }
        
        // 創建圖表
        this.charts.elements = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            font: {
                                size: 14
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                const percentage = Math.round((value / total) * 100);
                                return `${label}: ${percentage}%`;
                            }
                        }
                    }
                }
            }
        });
    }

    /**
     * 初始化0-12月好帶指數曲線圖
     * @param {string} canvasId - Canvas元素ID
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     */
    initGrowthChart(canvasId, bazi, elementAnalysis) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        
        // 清除現有圖表
        if (this.charts.growth) {
            this.charts.growth.destroy();
        }
        
        // 生成0-12月好帶指數數據
        const chartData = this.generateCareabilityIndexData(bazi, elementAnalysis);
        
        // 創建圖表
        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: '月齡',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        }
                    },
                    y: {
                        beginAtZero: true,
                        max: 10,
                        min: 1,
                        title: {
                            display: true,
                            text: '好帶指數 (1-10分)',
                            font: {
                                size: 14,
                                weight: 'bold'
                            }
                        },
                        ticks: {
                            stepSize: 1
                        }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top',
                        labels: {
                            font: {
                                size: 12
                            }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return `${context.dataset.label}: ${context.raw}分`;
                            }
                        }
                    }
                },
                elements: {
                    line: {
                        tension: 0.4
                    },
                    point: {
                        radius: 6,
                        hoverRadius: 8
                    }
                }
            }
        });
        
        // 更新圖表分析文字
        this.updateCareabilityAnalysis(elementAnalysis);
    }
    
    /**
     * 生成0-12月好帶指數數據
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 圖表數據
     */
    generateCareabilityIndexData(bazi, elementAnalysis) {
        // 生成0-12月的月齡標籤
        const labels = [];
        for (let i = 0; i <= 12; i++) {
            labels.push(`${i}M`);
        }
        
        const dayElement = elementAnalysis.dayElement;
        const dayElementStrength = elementAnalysis.dayElementStrength;
        
        // 根據八字特徵計算基礎好帶指數
        let baseIndex = this.calculateBaseCareabilityIndex(dayElement, dayElementStrength);
        
        // 生成每月的好帶指數
        const careabilityData = [];
        
        for (let month = 0; month <= 12; month++) {
            let monthlyIndex = baseIndex;
            
            // 根據不同月齡的發展特點調整指數
            if (month <= 2) {
                // 0-2月：新生兒期，根據五行特質調整
                monthlyIndex += this.getNewbornAdjustment(dayElement, month);
            } else if (month <= 6) {
                // 3-6月：嬰兒期，開始有更多互動
                monthlyIndex += this.getInfantAdjustment(dayElement, month);
            } else if (month <= 12) {
                // 7-12月：學步期，活動力增加
                monthlyIndex += this.getToddlerAdjustment(dayElement, month);
            }
            
            // 確保指數在1-10範圍內
            monthlyIndex = Math.max(1, Math.min(10, monthlyIndex));
            careabilityData.push(Math.round(monthlyIndex * 10) / 10);
        }
        
        return {
            labels: labels,
            datasets: [{
                label: '好帶指數',
                data: careabilityData,
                borderColor: '#ff6b6b',
                backgroundColor: 'rgba(255, 107, 107, 0.1)',
                borderWidth: 3,
                fill: true,
                pointBackgroundColor: '#ff6b6b',
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2
            }]
        };
    }
    
    /**
     * 計算基礎好帶指數
     * @param {string} dayElement - 日主五行
     * @param {string} strength - 五行強度
     * @returns {number} - 基礎指數
     */
    calculateBaseCareabilityIndex(dayElement, strength) {
        let baseIndex = 5; // 預設中等好帶
        
        // 根據五行特質調整基礎指數
        switch (dayElement) {
            case '木':
                baseIndex = 6; // 木質寶寶相對好帶，但需要關注
                break;
            case '火':
                baseIndex = 4; // 火質寶寶較為活躍，需要更多耐心
                break;
            case '土':
                baseIndex = 7; // 土質寶寶較為穩定，相對好帶
                break;
            case '金':
                baseIndex = 5; // 金質寶寶中等，需要規律
                break;
            case '水':
                baseIndex = 6; // 水質寶寶適應性強，相對好帶
                break;
        }
        
        // 根據五行強度調整
        if (strength === '強') {
            baseIndex -= 1; // 五行強的寶寶個性較強，稍微難帶一些
        } else if (strength === '弱') {
            baseIndex += 0.5; // 五行弱的寶寶較為溫和
        }
        
        return baseIndex;
    }
    
    /**
     * 新生兒期調整 (0-2月)
     */
    getNewbornAdjustment(dayElement, month) {
        let adjustment = 0;
        
        switch (dayElement) {
            case '木':
                adjustment = month === 0 ? -1 : (month === 1 ? -0.5 : 0);
                break;
            case '火':
                adjustment = month === 0 ? -1.5 : (month === 1 ? -1 : -0.5);
                break;
            case '土':
                adjustment = month === 0 ? 0 : (month === 1 ? 0.5 : 1);
                break;
            case '金':
                adjustment = month === 0 ? -0.5 : (month === 1 ? 0 : 0.5);
                break;
            case '水':
                adjustment = month === 0 ? -0.5 : (month === 1 ? 0 : 0.5);
                break;
        }
        
        return adjustment;
    }
    
    /**
     * 嬰兒期調整 (3-6月)
     */
    getInfantAdjustment(dayElement, month) {
        let adjustment = 0;
        const monthInPhase = month - 2; // 0-4 (對應3-6月)
        
        switch (dayElement) {
            case '木':
                adjustment = monthInPhase * 0.3; // 逐漸變好帶
                break;
            case '火':
                adjustment = monthInPhase === 1 ? -0.5 : (monthInPhase >= 2 ? 0 : -1);
                break;
            case '土':
                adjustment = monthInPhase * 0.2; // 穩定上升
                break;
            case '金':
                adjustment = monthInPhase >= 2 ? 0.5 : 0;
                break;
            case '水':
                adjustment = monthInPhase * 0.25;
                break;
        }
        
        return adjustment;
    }
    
    /**
     * 學步期調整 (7-12月)
     */
    getToddlerAdjustment(dayElement, month) {
        let adjustment = 0;
        const monthInPhase = month - 6; // 1-6 (對應7-12月)
        
        switch (dayElement) {
            case '木':
                adjustment = monthInPhase <= 3 ? 0.5 : (monthInPhase >= 5 ? -0.5 : 0);
                break;
            case '火':
                adjustment = monthInPhase >= 3 ? -1 : -0.5; // 活動力增加，較難帶
                break;
            case '土':
                adjustment = monthInPhase <= 2 ? 0.5 : 0; // 前期穩定
                break;
            case '金':
                adjustment = monthInPhase >= 4 ? -0.5 : 0; // 後期需要更多規律
                break;
            case '水':
                adjustment = monthInPhase <= 4 ? 0.3 : 0;
                break;
        }
        
        return adjustment;
    }

    /**
     * 生成五行變化數據
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 圖表數據
     */
    generateElementsGrowthData(bazi, elementAnalysis) {
        // 生成0-10歲的年齡標籤
        const labels = [];
        for (let i = 0; i <= 10; i++) {
            labels.push(`${i}歲`);
        }
        
        // 生成五行數據
        const datasets = [];
        const elements = ['木', '火', '土', '金', '水'];
        const englishElements = ['wood', 'fire', 'earth', 'metal', 'water'];
        
        // 獲取基礎五行強度
        const baseStrengths = {};
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            baseStrengths[element] = elementAnalysis.elementStats[element] || 0;
        }
        
        // 為每個五行生成數據
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            const englishElement = englishElements[i];
            const data = [];
            
            // 根據年齡模擬五行變化
            for (let age = 0; age <= 10; age++) {
                // 基於基礎強度和年齡特性計算五行強度
                let strength = baseStrengths[element];
                
                // 根據年齡和五行特性調整強度
                switch (element) {
                    case '木':
                        // 木在幼年期較強，隨年齡增長趨於穩定
                        strength *= (1 + 0.2 * Math.exp(-age / 3));
                        break;
                    case '火':
                        // 火在3-7歲階段較強
                        strength *= (1 + 0.15 * Math.exp(-Math.pow(age - 5, 2) / 8));
                        break;
                    case '土':
                        // 土隨年齡增長逐漸增強
                        strength *= (1 + 0.1 * (1 - Math.exp(-age / 4)));
                        break;
                    case '金':
                        // 金在7-10歲階段較強
                        strength *= (1 + 0.15 * (1 - Math.exp(-(age - 3) / 5)));
                        break;
                    case '水':
                        // 水在各階段相對穩定，略有波動
                        strength *= (1 + 0.05 * Math.sin(age * Math.PI / 5));
                        break;
                }
                
                data.push(strength);
            }
            
            datasets.push({
                label: element,
                data: data,
                borderColor: this.colors[englishElement],
                backgroundColor: `${this.colors[englishElement]}33`,
                fill: false,
                tension: 0.4
            });
        }
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    /**
     * 生成星耀強度數據
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 圖表數據
     */
    generateStarsGrowthData(bazi, elementAnalysis) {
        // 生成0-10歲的年齡標籤
        const labels = [];
        for (let i = 0; i <= 10; i++) {
            labels.push(`${i}歲`);
        }
        
        // 定義星耀類型
        const stars = ['文昌', '祿星', '桃花', '華蓋', '將星'];
        const colors = ['#4b7bec', '#26de81', '#fd79a8', '#a55eea', '#f7b731'];
        
        // 為每個星耀生成數據
        const datasets = [];
        for (let i = 0; i < stars.length; i++) {
            const star = stars[i];
            const data = [];
            
            // 根據年齡模擬星耀強度變化
            for (let age = 0; age <= 10; age++) {
                // 基於八字特性和年齡特性計算星耀強度
                let strength = 0;
                
                // 根據星耀類型和年齡調整強度
                switch (star) {
                    case '文昌': // 學習能力
                        // 文昌星隨年齡增長逐漸增強
                        strength = 30 + 5 * age + 10 * Math.random();
                        break;
                    case '祿星': // 財運、資源
                        // 祿星在各階段相對穩定
                        strength = 50 + 2 * age + 15 * Math.random();
                        break;
                    case '桃花': // 人緣、社交
                        // 桃花星在3-7歲階段較強
                        strength = 40 + 15 * Math.exp(-Math.pow(age - 5, 2) / 10) + 10 * Math.random();
                        break;
                    case '華蓋': // 創造力、靈感
                        // 華蓋星在幼年期較強，隨後波動
                        strength = 45 + 10 * Math.sin(age * Math.PI / 4) + 10 * Math.random();
                        break;
                    case '將星': // 領導力、競爭力
                        // 將星隨年齡增長逐漸增強
                        strength = 25 + 6 * age + 10 * Math.random();
                        break;
                }
                
                // 根據日主五行調整星耀強度
                const dayElement = elementAnalysis.dayElement;
                switch (dayElement) {
                    case '木':
                        if (star === '文昌' || star === '將星') strength *= 1.1;
                        break;
                    case '火':
                        if (star === '桃花' || star === '華蓋') strength *= 1.1;
                        break;
                    case '土':
                        if (star === '祿星') strength *= 1.1;
                        break;
                    case '金':
                        if (star === '祿星' || star === '將星') strength *= 1.1;
                        break;
                    case '水':
                        if (star === '文昌' || star === '華蓋') strength *= 1.1;
                        break;
                }
                
                data.push(Math.min(100, strength)); // 限制最大值為100
            }
            
            datasets.push({
                label: star,
                data: data,
                borderColor: colors[i],
                backgroundColor: `${colors[i]}33`,
                fill: false,
                tension: 0.4
            });
        }
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    /**
     * 生成成長階段數據
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 圖表數據
     */
    generatePhasesGrowthData(bazi, elementAnalysis) {
        // 生成0-10歲的年齡標籤
        const labels = [];
        for (let i = 0; i <= 10; i++) {
            labels.push(`${i}歲`);
        }
        
        // 定義成長階段類型
        const phases = ['身體發展', '情緒發展', '認知發展', '社交發展', '自我意識'];
        const colors = ['#eb4d4b', '#f78fb3', '#3dc1d3', '#f19066', '#6ab04c'];
        
        // 為每個成長階段生成數據
        const datasets = [];
        for (let i = 0; i < phases.length; i++) {
            const phase = phases[i];
            const data = [];
            
            // 根據年齡模擬成長階段變化
            for (let age = 0; age <= 10; age++) {
                // 基於年齡特性計算成長階段強度
                let strength = 0;
                
                // 根據成長階段類型和年齡調整強度
                switch (phase) {
                    case '身體發展':
                        // 身體發展在幼年期快速增長，隨後趨於穩定
                        strength = 30 + 40 * (1 - Math.exp(-age / 3)) + 5 * Math.random();
                        break;
                    case '情緒發展':
                        // 情緒發展在2-5歲階段快速增長
                        strength = 20 + 30 * (1 - Math.exp(-age / 2)) + 10 * Math.sin(age * Math.PI / 5) + 5 * Math.random();
                        break;
                    case '認知發展':
                        // 認知發展隨年齡穩步增長
                        strength = 15 + 7 * age + 5 * Math.random();
                        break;
                    case '社交發展':
                        // 社交發展在3-7歲階段快速增長
                        strength = 10 + 30 * (1 - Math.exp(-(age - 1) / 3)) + 5 * Math.random();
                        break;
                    case '自我意識':
                        // 自我意識在5-10歲階段快速增長
                        strength = 5 + 40 * (1 - Math.exp(-(age - 3) / 4)) + 5 * Math.random();
                        break;
                }
                
                // 根據日主五行調整成長階段強度
                const dayElement = elementAnalysis.dayElement;
                switch (dayElement) {
                    case '木':
                        if (phase === '身體發展' || phase === '自我意識') strength *= 1.1;
                        break;
                    case '火':
                        if (phase === '情緒發展' || phase === '社交發展') strength *= 1.1;
                        break;
                    case '土':
                        if (phase === '身體發展' || phase === '情緒發展') strength *= 1.1;
                        break;
                    case '金':
                        if (phase === '認知發展' || phase === '自我意識') strength *= 1.1;
                        break;
                    case '水':
                        if (phase === '認知發展' || phase === '社交發展') strength *= 1.1;
                        break;
                }
                
                data.push(Math.min(100, strength)); // 限制最大值為100
            }
            
            datasets.push({
                label: phase,
                data: data,
                borderColor: colors[i],
                backgroundColor: `${colors[i]}33`,
                fill: false,
                tension: 0.4
            });
        }
        
        return {
            labels: labels,
            datasets: datasets
        };
    }

    /**
     * 更新好帶指數分析文字
     * @param {Object} elementAnalysis - 五行分析
     */
    updateCareabilityAnalysis(elementAnalysis) {
        const analysisElement = document.getElementById('chartAnalysis');
        const dayElement = elementAnalysis.dayElement;
        const dayElementStrength = elementAnalysis.dayElementStrength;
        
        let analysisText = `此圖表展示了寶寶從0到12個月期間的好帶指數變化趨勢。作為${dayElement}性寶寶（${dayElementStrength}），`;
        
        // 根據五行特質提供分析
        switch (dayElement) {
            case '木':
                analysisText += '整體來說相對好帶，但在新生兒期需要更多關注。木質寶寶天性好奇，隨著月齡增長會越來越活潑，建議：\n\n';
                analysisText += '• 0-2月：提供安靜穩定的環境，避免過度刺激\n';
                analysisText += '• 3-6月：開始增加視覺和聽覺刺激，滿足好奇心\n';
                analysisText += '• 7-12月：提供安全的探索空間，但要注意安全防護';
                break;
            case '火':
                analysisText += '相對較難帶，特別是在活動力增強的階段。火質寶寶情緒表達強烈，需要更多耐心，建議：\n\n';
                analysisText += '• 0-2月：保持環境溫暖舒適，及時回應需求\n';
                analysisText += '• 3-6月：建立規律作息，避免過度興奮\n';
                analysisText += '• 7-12月：提供充足的活動時間，幫助消耗精力';
                break;
            case '土':
                analysisText += '是最好帶的類型，性格穩定溫和。土質寶寶適應性強，作息規律，建議：\n\n';
                analysisText += '• 0-2月：建立穩定的餵養和睡眠規律\n';
                analysisText += '• 3-6月：逐步增加互動時間，培養社交能力\n';
                analysisText += '• 7-12月：保持規律作息，適度增加新體驗';
                break;
            case '金':
                analysisText += '中等好帶程度，需要規律和條理。金質寶寶喜歡秩序，對環境變化較敏感，建議：\n\n';
                analysisText += '• 0-2月：保持環境整潔有序，避免突然變化\n';
                analysisText += '• 3-6月：建立固定的日常程序\n';
                analysisText += '• 7-12月：逐步引入新事物，但要循序漸進';
                break;
            case '水':
                analysisText += '相對好帶，適應性強且聰明。水質寶寶思維活躍，學習能力強，建議：\n\n';
                analysisText += '• 0-2月：提供豐富但不過度的感官刺激\n';
                analysisText += '• 3-6月：增加互動遊戲，促進智力發展\n';
                analysisText += '• 7-12月：提供多樣化的學習機會和探索環境';
                break;
        }
        
        // 根據五行強度調整建議
        if (dayElementStrength === '強') {
            analysisText += '\n\n由於五行較強，寶寶個性會比較明顯，建議家長要有更多耐心，並建立清楚的界限和規則。';
        } else if (dayElementStrength === '弱') {
            analysisText += '\n\n由於五行較弱，寶寶性格相對溫和，但可能需要更多鼓勵和支持來建立自信心。';
        }
        
        analysisElement.innerHTML = analysisText.replace(/\n/g, '<br>');
    }
    
    /**
     * 下載圖表為PNG格式
     * @param {string} chartId - 圖表ID
     * @param {string} filename - 檔案名稱
     */
    downloadChartAsPNG(chartId, filename = '好帶指數圖表') {
        const canvas = document.getElementById(chartId);
        if (canvas) {
            const link = document.createElement('a');
            link.download = `${filename}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    }
    
    /**
     * 下載圖表為PDF格式
     * @param {string} chartId - 圖表ID
     * @param {string} filename - 檔案名稱
     */
    downloadChartAsPDF(chartId, filename = '好帶指數圖表') {
        const canvas = document.getElementById(chartId);
        if (canvas && window.jsPDF) {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new window.jsPDF();
            const imgWidth = 190;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            
            pdf.addImage(imgData, 'PNG', 10, 10, imgWidth, imgHeight);
            pdf.save(`${filename}.pdf`);
        } else {
            alert('PDF功能需要載入jsPDF庫');
        }
    }
}

// 創建圖表實例
const baziCharts = new BaziCharts();