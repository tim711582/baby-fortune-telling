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
     * 初始化成長階段圖表
     * @param {string} canvasId - Canvas元素ID
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     */
    initGrowthChart(canvasId, bazi, elementAnalysis) {
        const ctx = document.getElementById(canvasId).getContext('2d');
        const chartType = document.getElementById('chartType').value;
        
        // 清除現有圖表
        if (this.charts.growth) {
            this.charts.growth.destroy();
        }
        
        // 根據選擇的圖表類型生成數據
        let chartData;
        switch (chartType) {
            case 'elements':
                chartData = this.generateElementsGrowthData(bazi, elementAnalysis);
                break;
            case 'stars':
                chartData = this.generateStarsGrowthData(bazi, elementAnalysis);
                break;
            case 'phases':
                chartData = this.generatePhasesGrowthData(bazi, elementAnalysis);
                break;
            default:
                chartData = this.generateElementsGrowthData(bazi, elementAnalysis);
        }
        
        // 創建圖表
        this.charts.growth = new Chart(ctx, {
            type: 'line',
            data: chartData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                },
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        
        // 更新圖表分析文字
        this.updateChartAnalysis(chartType, elementAnalysis);
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
     * 更新圖表分析文字
     * @param {string} chartType - 圖表類型
     * @param {Object} elementAnalysis - 五行分析
     */
    updateChartAnalysis(chartType, elementAnalysis) {
        const analysisElement = document.getElementById('chartAnalysis');
        const dayElement = elementAnalysis.dayElement;
        
        let analysisText = '';
        
        switch (chartType) {
            case 'elements':
                analysisText = `此圖表展示了寶寶從0到10歲期間五行能量的變化趨勢。作為${dayElement}性寶寶，`;
                
                switch (dayElement) {
                    case '木':
                        analysisText += '木的能量在幼年期較為活躍，隨著年齡增長會趨於穩定。建議在幼年期給予足夠的自由探索空間，隨著年齡增長，逐漸引導建立規則意識和自律能力。';
                        break;
                    case '火':
                        analysisText += '火的能量在3-7歲階段較為活躍，情緒表達和創造力豐富。建議在這一階段多提供藝術和表演活動，同時幫助建立情緒管理能力。';
                        break;
                    case '土':
                        analysisText += '土的能量隨年齡增長逐漸增強，穩定性和責任感增強。建議在幼年期建立安全感和規律性，隨著年齡增長，培養責任意識和踏實性格。';
                        break;
                    case '金':
                        analysisText += '金的能量在7-10歲階段較為活躍，邏輯思維和判斷力增強。建議在這一階段培養條理性和分析能力，同時注意培養情感表達和靈活性。';
                        break;
                    case '水':
                        analysisText += '水的能量在各階段相對穩定，思維活躍且適應性強。建議在各階段均衡發展認知能力和社交能力，同時培養專注力和執行力。';
                        break;
                }
                break;
                
            case 'stars':
                analysisText = `此圖表展示了寶寶從0到10歲期間各種星耀能量的變化趨勢。作為${dayElement}性寶寶，`;
                
                switch (dayElement) {
                    case '木':
                        analysisText += '文昌星和將星的能量較為突出，表示在學習能力和領導力方面有較好的發展潛力。建議重點培養這些方面的能力，同時也要關注其他方面的均衡發展。';
                        break;
                    case '火':
                        analysisText += '桃花星和華蓋星的能量較為突出，表示在人際關係和創造力方面有較好的發展潛力。建議重點培養這些方面的能力，同時也要關注專注力和持久力的培養。';
                        break;
                    case '土':
                        analysisText += '祿星的能量較為突出，表示在資源獲取和穩定性方面有較好的發展潛力。建議重點培養這些方面的能力，同時也要關注創造力和靈活性的培養。';
                        break;
                    case '金':
                        analysisText += '祿星和將星的能量較為突出，表示在資源獲取和競爭力方面有較好的發展潛力。建議重點培養這些方面的能力，同時也要關注情感表達和創造力的培養。';
                        break;
                    case '水':
                        analysisText += '文昌星和華蓋星的能量較為突出，表示在學習能力和創造力方面有較好的發展潛力。建議重點培養這些方面的能力，同時也要關注執行力和堅持力的培養。';
                        break;
                }
                break;
                
            case 'phases':
                analysisText = `此圖表展示了寶寶從0到10歲期間各個發展階段的變化趨勢。作為${dayElement}性寶寶，`;
                
                switch (dayElement) {
                    case '木':
                        analysisText += '身體發展和自我意識的發展較為突出。在0-3歲階段，身體發展迅速；在5-10歲階段，自我意識快速增強。建議在幼年期注重身體活動和探索，在學齡期培養獨立性和自信心。';
                        break;
                    case '火':
                        analysisText += '情緒發展和社交發展較為突出。在2-5歲階段，情緒表達豐富；在3-7歲階段，社交能力快速發展。建議在這些階段提供豐富的社交機會和情緒表達渠道，同時幫助建立情緒管理能力。';
                        break;
                    case '土':
                        analysisText += '身體發展和情緒發展較為突出。在0-3歲階段，身體發展穩定；在2-5歲階段，情緒穩定性增強。建議在幼年期建立規律生活和安全感，在學前期培養情緒穩定性和責任感。';
                        break;
                    case '金':
                        analysisText += '認知發展和自我意識較為突出。在學齡期，這些能力快速發展。建議在學齡期提供豐富的學習機會和思考訓練，培養邏輯思維和獨立判斷能力。';
                        break;
                    case '水':
                        analysisText += '認知發展和社交發展較為突出。在各個階段，思維活躍且適應性強。建議在各階段均衡發展認知能力和社交能力，培養思考深度和溝通技巧。';
                        break;
                }
                break;
        }
        
        analysisElement.textContent = analysisText;
    }
}

// 創建圖表實例
const baziCharts = new BaziCharts();