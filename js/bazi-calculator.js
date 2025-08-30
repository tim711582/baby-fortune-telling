/**
 * 八字計算器 - 用於計算八字並提供基本分析
 */

class BaziCalculator {
    constructor() {
        // 天干
        this.heavenlyStems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        // 地支
        this.earthlyBranches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
        // 五行
        this.fiveElements = ['木', '火', '土', '金', '水'];
        // 天干五行對應
        this.stemElements = {
            '甲': '木', '乙': '木',
            '丙': '火', '丁': '火',
            '戊': '土', '己': '土',
            '庚': '金', '辛': '金',
            '壬': '水', '癸': '水'
        };
        // 地支五行對應
        this.branchElements = {
            '子': '水', '丑': '土',
            '寅': '木', '卯': '木',
            '辰': '土', '巳': '火',
            '午': '火', '未': '土',
            '申': '金', '酉': '金',
            '戌': '土', '亥': '水'
        };
        // 地支藏干
        this.hiddenStems = {
            '子': ['癸'],
            '丑': ['己', '癸', '辛'],
            '寅': ['甲', '丙', '戊'],
            '卯': ['乙'],
            '辰': ['戊', '乙', '癸'],
            '巳': ['丙', '庚', '戊'],
            '午': ['丁', '己'],
            '未': ['己', '丁', '乙'],
            '申': ['庚', '壬', '戊'],
            '酉': ['辛'],
            '戌': ['戊', '辛', '丁'],
            '亥': ['壬', '甲']
        };
        // 時辰對應表
        this.hourToBranch = {
            0: '子', 1: '丑', 2: '丑', 3: '寅', 4: '寅', 5: '卯',
            6: '卯', 7: '辰', 8: '辰', 9: '巳', 10: '巳', 11: '午',
            12: '午', 13: '未', 14: '未', 15: '申', 16: '申', 17: '酉',
            18: '酉', 19: '戌', 20: '戌', 21: '亥', 22: '亥', 23: '子'
        };
        // 納音五行
        this.naYin = {
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
            '丙辰': '沙中土', '丁巳': '沙中土',
            '戊午': '天上火', '己未': '天上火',
            '庚申': '石榴木', '辛酉': '石榴木',
            '壬戌': '大海水', '癸亥': '大海水'
        };
    }

    /**
     * 計算農曆年的天干地支
     * @param {number} year - 公曆年份
     * @returns {string} - 天干地支年柱
     */
    getYearPillar(year) {
        // 簡化計算，實際應使用農曆年
        const stemIndex = (year - 4) % 10;
        const branchIndex = (year - 4) % 12;
        return this.heavenlyStems[stemIndex] + this.earthlyBranches[branchIndex];
    }

    /**
     * 計算月柱
     * @param {number} year - 公曆年份
     * @param {number} month - 公曆月份 (1-12)
     * @returns {string} - 天干地支月柱
     */
    getMonthPillar(year, month) {
        // 改進的月柱計算，考慮年干和月份
        const yearStem = (year - 4) % 10;
        
        // 月柱天干計算公式：年干 * 2 + 月份
        let monthStem = (yearStem * 2 + month - 1) % 10;
        if (monthStem < 0) monthStem += 10;
        
        // 月柱地支：寅月為正月，依次類推
        let monthBranch = (month + 1) % 12;
        if (monthBranch < 0) monthBranch += 12;
        
        return this.heavenlyStems[monthStem] + this.earthlyBranches[monthBranch];
    }

    /**
     * 計算日柱
     * @param {number} year - 公曆年份
     * @param {number} month - 公曆月份 (1-12)
     * @param {number} day - 公曆日期
     * @returns {string} - 天干地支日柱
     */
    getDayPillar(year, month, day) {
        // 改進的日柱計算，使用更準確的算法
        // 基準日期：1900年1月1日為庚子日
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));
        
        // 確保計算結果為正數
        let stemIndex = (diffDays + 6) % 10; // 6是庚的索引
        let branchIndex = (diffDays + 0) % 12; // 0是子的索引
        
        if (stemIndex < 0) stemIndex += 10;
        if (branchIndex < 0) branchIndex += 12;
        
        return this.heavenlyStems[stemIndex] + this.earthlyBranches[branchIndex];
    }

    /**
     * 計算時柱
     * @param {number} year - 公曆年份
     * @param {number} month - 公曆月份 (1-12)
     * @param {number} day - 公曆日期
     * @param {number} hour - 小時 (0-23)
     * @returns {string} - 天干地支時柱
     */
    getHourPillar(year, month, day, hour) {
        // 獲取日柱天干
        const dayPillar = this.getDayPillar(year, month, day);
        const dayStem = dayPillar.charAt(0);
        const dayStemIndex = this.heavenlyStems.indexOf(dayStem);
        
        // 獲取時辰地支
        const hourBranch = this.hourToBranch[hour];
        const hourBranchIndex = this.earthlyBranches.indexOf(hourBranch);
        
        // 時柱天干計算：日干配時支
        // 甲己日起甲子，乙庚日起丙子，丙辛日起戊子，丁壬日起庚子，戊癸日起壬子
        const hourStemBase = [0, 2, 4, 6, 8]; // 甲丙戊庚壬的索引
        let hourStemIndex;
        
        if (dayStemIndex === 0 || dayStemIndex === 5) { // 甲日或己日
            hourStemIndex = (0 + hourBranchIndex) % 10;
        } else if (dayStemIndex === 1 || dayStemIndex === 6) { // 乙日或庚日
            hourStemIndex = (2 + hourBranchIndex) % 10;
        } else if (dayStemIndex === 2 || dayStemIndex === 7) { // 丙日或辛日
            hourStemIndex = (4 + hourBranchIndex) % 10;
        } else if (dayStemIndex === 3 || dayStemIndex === 8) { // 丁日或壬日
            hourStemIndex = (6 + hourBranchIndex) % 10;
        } else { // 戊日或癸日
            hourStemIndex = (8 + hourBranchIndex) % 10;
        }
        
        return this.heavenlyStems[hourStemIndex] + hourBranch;
    }

    /**
     * 計算完整八字
     * @param {number} year - 公曆年份
     * @param {number} month - 公曆月份 (1-12)
     * @param {number} day - 公曆日期
     * @param {number} hour - 小時 (0-23)
     * @returns {Object} - 八字信息
     */
    calculateBazi(year, month, day, hour) {
        const yearPillar = this.getYearPillar(year);
        const monthPillar = this.getMonthPillar(year, month);
        const dayPillar = this.getDayPillar(year, month, day);
        const hourPillar = this.getHourPillar(year, month, day, hour);
        
        return {
            yearPillar,
            monthPillar,
            dayPillar,
            hourPillar,
            fullBazi: yearPillar + monthPillar + dayPillar + hourPillar
        };
    }

    /**
     * 分析八字中的五行分布
     * @param {Object} bazi - 八字信息
     * @returns {Object} - 五行分布統計
     */
    analyzeElements(bazi) {
        const elements = {
            '木': 0,
            '火': 0,
            '土': 0,
            '金': 0,
            '水': 0
        };
        
        // 分析天干
        const stems = [
            bazi.yearPillar.charAt(0),
            bazi.monthPillar.charAt(0),
            bazi.dayPillar.charAt(0),
            bazi.hourPillar.charAt(0)
        ];
        
        stems.forEach(stem => {
            elements[this.stemElements[stem]]++;
        });
        
        // 分析地支
        const branches = [
            bazi.yearPillar.charAt(1),
            bazi.monthPillar.charAt(1),
            bazi.dayPillar.charAt(1),
            bazi.hourPillar.charAt(1)
        ];
        
        branches.forEach(branch => {
            elements[this.branchElements[branch]] += 0.5;
            
            // 分析地支藏干
            this.hiddenStems[branch].forEach(hiddenStem => {
                elements[this.stemElements[hiddenStem]] += 0.3;
            });
        });
        
        return elements;
    }

    /**
     * 分析八字喜用神
     * @param {Object} bazi - 八字信息
     * @param {Object} elementStats - 五行分布統計
     * @returns {Object} - 喜用神分析
     */
    analyzeFavorableElements(bazi, elementStats) {
        // 獲取日主五行
        const dayStem = bazi.dayPillar.charAt(0);
        const dayElement = this.stemElements[dayStem];
        
        // 計算五行強弱
        const totalScore = Object.values(elementStats).reduce((a, b) => a + b, 0);
        const normalizedStats = {};
        
        for (const element in elementStats) {
            normalizedStats[element] = elementStats[element] / totalScore * 100;
        }
        
        // 判斷日主強弱
        const dayElementScore = normalizedStats[dayElement];
        let dayElementStrength = "中";
        
        if (dayElementScore > 30) {
            dayElementStrength = "強";
        } else if (dayElementScore < 15) {
            dayElementStrength = "弱";
        }
        
        // 確定喜用神
        let favorable = [];
        let unfavorable = [];
        
        if (dayElementStrength === "強") {
            // 日主強，喜歡克我的和我克的
            switch (dayElement) {
                case "木":
                    favorable = ["金", "火"];
                    unfavorable = ["水", "木"];
                    break;
                case "火":
                    favorable = ["水", "土"];
                    unfavorable = ["木", "火"];
                    break;
                case "土":
                    favorable = ["木", "金"];
                    unfavorable = ["火", "土"];
                    break;
                case "金":
                    favorable = ["火", "水"];
                    unfavorable = ["土", "金"];
                    break;
                case "水":
                    favorable = ["土", "木"];
                    unfavorable = ["金", "水"];
                    break;
            }
        } else {
            // 日主弱，喜歡生我的和我生的
            switch (dayElement) {
                case "木":
                    favorable = ["水", "火"];
                    unfavorable = ["金", "土"];
                    break;
                case "火":
                    favorable = ["木", "土"];
                    unfavorable = ["水", "金"];
                    break;
                case "土":
                    favorable = ["火", "金"];
                    unfavorable = ["木", "水"];
                    break;
                case "金":
                    favorable = ["土", "水"];
                    unfavorable = ["火", "木"];
                    break;
                case "水":
                    favorable = ["金", "木"];
                    unfavorable = ["土", "火"];
                    break;
            }
        }
        
        return {
            dayElement,
            dayElementStrength,
            favorable,
            unfavorable,
            elementStats: normalizedStats
        };
    }

    /**
     * 分析八字納音
     * @param {Object} bazi - 八字信息
     * @returns {Object} - 納音信息
     */
    analyzeNaYin(bazi) {
        const yearNaYin = this.naYin[bazi.yearPillar] || '未知';
        const monthNaYin = this.naYin[bazi.monthPillar] || '未知';
        const dayNaYin = this.naYin[bazi.dayPillar] || '未知';
        const hourNaYin = this.naYin[bazi.hourPillar] || '未知';
        
        return {
            yearNaYin,
            monthNaYin,
            dayNaYin,
            hourNaYin
        };
    }

    /**
     * 分析性格特質
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 性格分析
     */
    /**
     * 分析寶寶性格與情緒傾向標籤
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析結果
     * @returns {Object} - 包含5-8個性格標籤的分析結果
     */
    analyzePersonality(bazi, elementAnalysis) {
        const personalityTags = [];
        const details = [];
        
        // 根據日主五行分析寶寶基本性格傾向
        const dayElement = elementAnalysis.dayElement;
        
        switch (dayElement) {
            case "木":
                personalityTags.push("好奇心旺", "依附敏感", "成長導向");
                details.push("木質寶寶天生好奇，對新事物充滿興趣，喜歡探索環境。");
                details.push("對主要照顧者依附性較強，需要穩定的情感連結。");
                details.push("具有強烈的成長慾望，學習能力佳，適應力強。");
                break;
            case "火":
                personalityTags.push("活力充沛", "表達豐富", "情緒波動");
                details.push("火質寶寶精力旺盛，喜歡互動和表達，反應敏捷。");
                details.push("情感表達直接豐富，容易感染他人情緒。");
                details.push("情緒變化較快，需要耐心引導情緒管理。");
                break;
            case "土":
                personalityTags.push("規律依賴", "可安撫", "穩定需求");
                details.push("土質寶寶喜歡規律作息，對環境變化較為敏感。");
                details.push("容易被安撫，喜歡重複性的安全感活動。");
                details.push("需要穩定的環境和照顧模式，適應新環境需要時間。");
                break;
            case "金":
                personalityTags.push("秩序偏好", "精細敏感", "自律傾向");
                details.push("金質寶寶喜歡有序的環境，對細節變化敏感。");
                details.push("觸覺和聽覺較為敏銳，容易受環境刺激影響。");
                details.push("具有自我調節的潛力，但需要適當的引導和支持。");
                break;
            case "水":
                personalityTags.push("適應靈活", "觀察敏銳", "內向傾向");
                details.push("水質寶寶適應能力強，能夠靈活應對環境變化。");
                details.push("觀察力敏銳，喜歡靜靜觀察周圍的人事物。");
                details.push("可能較為內向，需要溫和的鼓勵來表達自己。");
                break;
        }
        
        // 根據五行強弱分析情緒調節能力
        if (elementAnalysis.dayElementStrength === "強") {
            personalityTags.push("自主性強");
            details.push("寶寶自主性較強，有自己的想法和偏好，需要尊重其個性。");
        } else if (elementAnalysis.dayElementStrength === "弱") {
            personalityTags.push("需要支持");
            details.push("寶寶較需要外在支持和鼓勵，在安全感充足時表現更佳。");
        } else {
            personalityTags.push("平衡發展");
            details.push("寶寶各方面發展較為平衡，容易建立穩定的作息和習慣。");
        }
        
        // 分析地支組合對情緒模式的影響
        const branches = [
            bazi.yearPillar.charAt(1),
            bazi.monthPillar.charAt(1),
            bazi.dayPillar.charAt(1),
            bazi.hourPillar.charAt(1)
        ];
        
        // 檢查特殊組合
        const hasWaterElements = branches.filter(branch => ['子', '亥'].includes(branch)).length;
        const hasFireElements = branches.filter(branch => ['午', '巳'].includes(branch)).length;
        const hasEarthElements = branches.filter(branch => ['丑', '辰', '未', '戌'].includes(branch)).length;
        
        if (hasWaterElements >= 2) {
            personalityTags.push("情感豐富");
            details.push("情感世界豐富，對情緒變化敏感，需要情感上的理解和支持。");
        }
        
        if (hasFireElements >= 2) {
            personalityTags.push("社交傾向");
            details.push("喜歡與人互動，在社交環境中表現活躍，容易成為注意焦點。");
        }
        
        if (hasEarthElements >= 2) {
            personalityTags.push("安全導向");
            details.push("對安全感需求較高，喜歡熟悉的環境和人物，變化需要循序漸進。");
        }
        
        // 確保標籤數量在5-8個之間
        const finalTags = personalityTags.slice(0, 8);
        if (finalTags.length < 5) {
            // 如果標籤不足5個，根據整體八字特徵補充
            const additionalTags = ["溫和親近", "學習導向", "創意潛能"];
            for (let tag of additionalTags) {
                if (finalTags.length < 5 && !finalTags.includes(tag)) {
                    finalTags.push(tag);
                }
            }
        }
        
        return {
            personalityTags: finalTags,
            details,
            summary: `根據八字分析，寶寶具有${finalTags.join('、')}等特質，建議照顧者針對這些特點制定相應的照護策略。`
        };
    }

    /**
     * 分析寶寶成長階段特點
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 成長階段分析
     */
    analyzeGrowthPhases(bazi, elementAnalysis) {
        const phases = [];
        
        // 分析0-3歲階段
        phases.push({
            age: "0-3歲",
            title: "基礎發展期",
            description: this.getEarlyChildhoodAdvice(elementAnalysis)
        });
        
        // 分析4-6歲階段
        phases.push({
            age: "4-6歲",
            title: "探索學習期",
            description: this.getPreschoolAdvice(elementAnalysis)
        });
        
        // 分析7-10歲階段
        phases.push({
            age: "7-10歲",
            title: "能力培養期",
            description: this.getElementaryAdvice(elementAnalysis)
        });
        
        return phases;
    }

    /**
     * 獲取0-3歲階段建議
     * @param {Object} elementAnalysis - 五行分析
     * @returns {string} - 建議內容
     */
    getEarlyChildhoodAdvice(elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const strength = elementAnalysis.dayElementStrength;
        
        let advice = "";
        
        switch (dayElement) {
            case "木":
                advice = "木性寶寶在幼年期需要充分的自由空間和探索機會。";
                if (strength === "強") {
                    advice += "木性較強，可能較為固執，建議適當引導而非強制，培養耐心和專注力。";
                } else {
                    advice += "木性較弱，需要多鼓勵表達和嘗試，增強自信心，提供穩定的環境。";
                }
                break;
            case "火":
                advice = "火性寶寶在幼年期需要適當的情感表達和社交互動。";
                if (strength === "強") {
                    advice += "火性較強，情緒可能波動大，需要幫助調節情緒，建立規律作息。";
                } else {
                    advice += "火性較弱，需要多一些溫暖的互動和鼓勵，培養表達能力和自信心。";
                }
                break;
            case "土":
                advice = "土性寶寶在幼年期需要穩定的環境和明確的界限。";
                if (strength === "強") {
                    advice += "土性較強，可能較為固執保守，需要鼓勵嘗試新事物，培養靈活性。";
                } else {
                    advice += "土性較弱，需要建立安全感和規律性，幫助形成良好的生活習慣。";
                }
                break;
            case "金":
                advice = "金性寶寶在幼年期需要秩序和結構化的環境。";
                if (strength === "強") {
                    advice += "金性較強，可能較為固執和完美主義，需要學習接受不完美，培養彈性。";
                } else {
                    advice += "金性較弱，需要幫助建立自律和秩序感，培養專注力和堅持力。";
                }
                break;
            case "水":
                advice = "水性寶寶在幼年期需要豐富的認知刺激和學習機會。";
                if (strength === "強") {
                    advice += "水性較強，思維活躍，可能注意力不集中，需要幫助建立專注力和耐心。";
                } else {
                    advice += "水性較弱，需要多提供探索和學習的機會，培養好奇心和思考能力。";
                }
                break;
        }
        
        return advice;
    }

    /**
     * 獲取4-6歲階段建議
     * @param {Object} elementAnalysis - 五行分析
     * @returns {string} - 建議內容
     */
    getPreschoolAdvice(elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const strength = elementAnalysis.dayElementStrength;
        
        let advice = "";
        
        switch (dayElement) {
            case "木":
                advice = "木性寶寶在學前期適合參與創意和自然相關活動，培養組織能力和領導力。";
                if (strength === "強") {
                    advice += "木性較強，需要學習合作和分享，可以參加團體活動培養社交能力。";
                } else {
                    advice += "木性較弱，需要鼓勵主動表達想法，培養決策能力和自信心。";
                }
                break;
            case "火":
                advice = "火性寶寶在學前期適合參與表演和藝術活動，培養創造力和表達能力。";
                if (strength === "強") {
                    advice += "火性較強，需要學習專注和耐心，可以通過靜態活動如繪畫來平衡能量。";
                } else {
                    advice += "火性較弱，需要多鼓勵參與互動和表演活動，增強自信和表現力。";
                }
                break;
            case "土":
                advice = "土性寶寶在學前期適合參與結構化和實用性活動，培養責任感和踏實性。";
                if (strength === "強") {
                    advice += "土性較強，需要增加創意和想像力的培養，避免過於死板。";
                } else {
                    advice += "土性較弱，需要建立明確的規則和期望，培養自律和責任感。";
                }
                break;
            case "金":
                advice = "金性寶寶在學前期適合參與精細動作和邏輯思維活動，培養專注力和分析能力。";
                if (strength === "強") {
                    advice += "金性較強，需要增加創意和情感表達的活動，避免過於嚴肅。";
                } else {
                    advice += "金性較弱，需要培養條理性和完成任務的能力，建立自信心。";
                }
                break;
            case "水":
                advice = "水性寶寶在學前期適合參與探索和認知活動，培養思考能力和適應力。";
                if (strength === "強") {
                    advice += "水性較強，需要建立規律和界限，幫助集中注意力和完成任務。";
                } else {
                    advice += "水性較弱，需要鼓勵好奇心和提問，培養獨立思考能力。";
                }
                break;
        }
        
        return advice;
    }

    /**
     * 獲取7-10歲階段建議
     * @param {Object} elementAnalysis - 五行分析
     * @returns {string} - 建議內容
     */
    getElementaryAdvice(elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const strength = elementAnalysis.dayElementStrength;
        
        let advice = "";
        
        switch (dayElement) {
            case "木":
                advice = "木性寶寶在小學階段適合發展組織能力和創新思維，培養領導才能。";
                if (strength === "強") {
                    advice += "木性較強，需要學習傾聽和尊重他人意見，培養團隊合作精神。";
                } else {
                    advice += "木性較弱，需要鼓勵參與決策和表達觀點，增強自信和堅持力。";
                }
                break;
            case "火":
                advice = "火性寶寶在小學階段適合發展創造力和表達能力，培養社交技巧。";
                if (strength === "強") {
                    advice += "火性較強，需要學習專注和深入思考，培養耐心和毅力。";
                } else {
                    advice += "火性較弱，需要鼓勵積極參與和表現自我，培養熱情和活力。";
                }
                break;
            case "土":
                advice = "土性寶寶在小學階段適合發展實用技能和責任感，培養穩定性和可靠性。";
                if (strength === "強") {
                    advice += "土性較強，需要鼓勵嘗試新事物和接受變化，培養靈活性。";
                } else {
                    advice += "土性較弱，需要幫助建立自律和時間管理能力，培養堅持力。";
                }
                break;
            case "金":
                advice = "金性寶寶在小學階段適合發展邏輯思維和分析能力，培養精確性和判斷力。";
                if (strength === "強") {
                    advice += "金性較強，需要培養情感表達和同理心，避免過於批判。";
                } else {
                    advice += "金性較弱，需要幫助建立自信和決斷力，培養獨立思考能力。";
                }
                break;
            case "水":
                advice = "水性寶寶在小學階段適合發展思考能力和創新思維，培養適應力和洞察力。";
                if (strength === "強") {
                    advice += "水性較強，需要學習實踐和執行力，將想法轉化為行動。";
                } else {
                    advice += "水性較弱，需要鼓勵獨立思考和問題解決，培養智慧和靈活性。";
                }
                break;
        }
        
        return advice;
    }

    /**
     * 生成整體摘要（0-6歲）
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Object} - 整體摘要數據
     */
    generateOverallSummary(bazi, elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const strength = elementAnalysis.dayElementStrength;
        const favorable = elementAnalysis.favorable;
        
        return {
            personalityHighlights: this.getPersonalityHighlights(dayElement, strength),
            ageStageSummary: this.getAgeStageSummary(dayElement, strength),
            groupLifeAdvice: this.getGroupLifeAdvice(dayElement, strength, favorable)
        };
    }

    /**
     * 獲取性格重點
     * @param {string} dayElement - 日主五行
     * @param {string} strength - 五行強弱
     * @returns {Array} - 性格重點列表
     */
    getPersonalityHighlights(dayElement, strength) {
        const baseTraits = {
            '木': ['富有創造力和想像力', '喜歡探索和學習新事物', '具有成長導向的思維', '天生的領導潛質'],
            '火': ['熱情活潑，表達能力強', '情感豐富，善於社交', '具有藝術天賦和創造力', '樂觀積極的生活態度'],
            '土': ['穩重可靠，適應力強', '具有責任感和耐心', '善於照顧他人', '實用主義的思考方式'],
            '金': ['邏輯思維清晰', '注重秩序和規律', '具有分析和判斷能力', '追求完美和精確'],
            '水': ['感受力敏銳，直覺力強', '善於傾聽和理解他人', '具有深度思考能力', '適應變化的靈活性']
        };
        
        let traits = [...baseTraits[dayElement]];
        
        if (strength === '強') {
            const strongTraits = {
                '木': ['個性較為堅持，需要引導學習妥協'],
                '火': ['情緒表達強烈，需要學習情緒管理'],
                '土': ['可能較為固執，需要鼓勵接受新事物'],
                '金': ['標準較高，需要學習包容和彈性'],
                '水': ['情感深刻，需要適當的情緒出口']
            };
            traits.push(...strongTraits[dayElement]);
        } else {
            const weakTraits = {
                '木': ['需要鼓勵表達想法，增強自信心'],
                '火': ['需要多一些溫暖互動，培養表達能力'],
                '土': ['需要穩定環境，逐步建立安全感'],
                '金': ['需要清晰指導，建立自信和條理'],
                '水': ['需要情感支持，培養表達和溝通能力']
            };
            traits.push(...weakTraits[dayElement]);
        }
        
        return traits;
    }

    /**
     * 獲取年齡段摘要
     * @param {string} dayElement - 日主五行
     * @param {string} strength - 五行強弱
     * @returns {Object} - 年齡段摘要
     */
    getAgeStageSummary(dayElement, strength) {
        return {
            '0-2歲': this.getInfantStageSummary(dayElement, strength),
            '3-4歲': this.getToddlerStageSummary(dayElement, strength),
            '5-6歲': this.getPreschoolStageSummary(dayElement, strength)
        };
    }

    /**
     * 獲取0-2歲階段摘要
     */
    getInfantStageSummary(dayElement, strength) {
        const baseSummary = {
            '木': '需要充足的自由探索空間，對新環境適應較快',
            '火': '情感表達豐富，需要溫暖的互動和回應',
            '土': '喜歡穩定的環境和規律，適應變化需要時間',
            '金': '對環境敏感，需要整潔有序的照護環境',
            '水': '感受力強，需要安靜舒適的環境和情感連結'
        };
        
        let summary = baseSummary[dayElement];
        
        if (strength === '強') {
            summary += '，個性較為明顯，需要耐心引導';
        } else {
            summary += '，需要更多鼓勵和支持來建立自信';
        }
        
        return summary;
    }

    /**
     * 獲取3-4歲階段摘要
     */
    getToddlerStageSummary(dayElement, strength) {
        const baseSummary = {
            '木': '創造力開始顯現，喜歡動手操作和探索',
            '火': '社交能力發展，喜歡與人互動和表演',
            '土': '責任感萌芽，喜歡幫助他人和參與家務',
            '金': '邏輯思維開始發展，喜歡分類和整理',
            '水': '想像力豐富，喜歡聽故事和安靜的活動'
        };
        
        let summary = baseSummary[dayElement];
        
        if (strength === '強') {
            summary += '，自主性較強，需要適當的界限設定';
        } else {
            summary += '，需要鼓勵嘗試新事物，培養自信心';
        }
        
        return summary;
    }

    /**
     * 獲取5-6歲階段摘要
     */
    getPreschoolStageSummary(dayElement, strength) {
        const baseSummary = {
            '木': '領導能力顯現，適合參與團體活動和創意遊戲',
            '火': '表達能力強，適合藝術創作和表演活動',
            '土': '穩定性增強，適合承擔小責任和幫助他人',
            '金': '分析能力發展，適合邏輯遊戲和規則性活動',
            '水': '理解力深刻，適合閱讀和需要專注的活動'
        };
        
        let summary = baseSummary[dayElement];
        
        if (strength === '強') {
            summary += '，準備好迎接更多挑戰和學習機會';
        } else {
            summary += '，需要循序漸進的引導和充分的準備時間';
        }
        
        return summary;
    }

    /**
     * 獲取團體生活建議
     * @param {string} dayElement - 日主五行
     * @param {string} strength - 五行強弱
     * @param {Array} favorable - 有利五行
     * @returns {Array} - 團體生活建議列表
     */
    getGroupLifeAdvice(dayElement, strength, favorable) {
        const baseAdvice = {
            '木': [
                '鼓勵參與需要創意和領導的團體活動',
                '教導分享和輪流的概念',
                '培養團隊合作精神，學習聆聽他人意見'
            ],
            '火': [
                '提供表達和展示的機會',
                '教導情緒管理和同理心',
                '鼓勵參與互動性強的團體遊戲'
            ],
            '土': [
                '安排穩定的團體環境和固定夥伴',
                '鼓勵承擔小組責任和幫助他人',
                '逐步適應團體規則和變化'
            ],
            '金': [
                '提供清晰的團體規則和期望',
                '鼓勵參與有組織的活動',
                '培養公平競爭和遵守規則的精神'
            ],
            '水': [
                '提供安靜和諧的團體環境',
                '鼓勵深度交流和建立友誼',
                '培養傾聽和理解他人的能力'
            ]
        };
        
        let advice = [...baseAdvice[dayElement]];
        
        if (strength === '強') {
            advice.push('需要學習謙讓和包容，避免過於堅持己見');
        } else {
            advice.push('需要鼓勵表達想法，增強在團體中的自信心');
        }
        
        // 根據有利五行添加建議
        if (favorable.includes('木')) {
            advice.push('適合參與戶外和自然相關的團體活動');
        }
        if (favorable.includes('火')) {
            advice.push('適合參與熱鬧和互動性強的團體活動');
        }
        if (favorable.includes('土')) {
            advice.push('適合參與穩定和有規律的團體活動');
        }
        if (favorable.includes('金')) {
            advice.push('適合參與有組織和競爭性的團體活動');
        }
        if (favorable.includes('水')) {
            advice.push('適合參與安靜和需要專注的團體活動');
        }
        
        return advice;
    }

    /**
     * 生成0-12月月齡表格
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {Array} - 月齡表格數據
     */
    generateMonthlyTable(bazi, elementAnalysis) {
        const monthlyTable = [];
        const dayElement = elementAnalysis.dayElement;
        const favorable = elementAnalysis.favorable;
        
        // 將12個月分為6個階段，每2月一組
        const stages = [
            { months: [0, 1], title: "0-1月", period: "新生兒期" },
            { months: [2, 3], title: "2-3月", period: "適應期" },
            { months: [4, 5], title: "4-5月", period: "互動期" },
            { months: [6, 7], title: "6-7月", period: "探索期" },
            { months: [8, 9], title: "8-9月", period: "爬行期" },
            { months: [10, 11, 12], title: "10-12月", period: "學步期" }
        ];
        
        stages.forEach(stage => {
            const stageData = this.getMonthlyStageData(stage, dayElement, favorable);
            monthlyTable.push(stageData);
        });
        
        return monthlyTable;
    }
    
    /**
     * 獲取月齡階段數據
     * @param {Object} stage - 階段信息
     * @param {string} dayElement - 日主五行
     * @param {Array} favorable - 有利五行
     * @returns {Object} - 階段數據
     */
    getMonthlyStageData(stage, dayElement, favorable) {
        const { months, title, period } = stage;
        
        return {
            title,
            period,
            months,
            characteristics: this.getStageCharacteristics(months, dayElement),
            challenges: this.getStageChallenges(months, dayElement),
            careAdvice: this.getStageCareAdvice(months, dayElement, favorable)
        };
    }
    
    /**
     * 獲取階段帶養特色
     * @param {Array} months - 月齡範圍
     * @param {string} dayElement - 日主五行
     * @returns {Array} - 特色列表
     */
    getStageCharacteristics(months, dayElement) {
        const startMonth = months[0];
        let baseCharacteristics = [];
        
        if (startMonth <= 1) {
            const options = [
                ["睡眠時間長，一天16-18小時", "需要頻繁餵養，2-3小時一次", "對聲音敏感，容易被驚醒", "喜歡被包裹的安全感"],
                ["新生兒反射明顯", "視力模糊但對光線敏感", "哭聲是主要溝通方式", "需要大量的肌膚接觸"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 3) {
            const options = [
                ["開始有社交微笑", "頭部控制能力增強", "對人臉有興趣", "哭聲開始有不同含義"],
                ["眼神開始追蹤物體", "開始發出咕咕聲", "手部動作更協調", "對音樂有反應"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 5) {
            const options = [
                ["可以翻身", "開始抓握物品", "對鏡子感興趣", "笑聲更加豐富"],
                ["頭部可以穩定抬起", "開始伸手抓取玩具", "對顏色鮮豔的物品感興趣", "開始有規律的睡眠模式"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 7) {
            const options = [
                ["可以坐立", "開始添加副食品", "對陌生人有警戒", "喜歡敲打玩具"],
                ["可以不靠支撐坐著", "開始用手指抓取小物品", "認得熟悉的人", "喜歡把東西放進嘴裡探索"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 9) {
            const options = [
                ["開始爬行", "可以自己坐穩", "模仿大人動作", "對小物品感興趣"],
                ["可以扶著站立", "開始理解簡單的詞彙", "喜歡玩躲貓貓遊戲", "開始有分離焦慮"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        } else {
            const options = [
                ["開始站立行走", "理解簡單指令", "喜歡探索環境", "開始說單字"],
                ["可以獨立站立幾秒", "開始用手勢溝通", "喜歡模仿聲音", "對因果關係有初步理解"]
            ];
            baseCharacteristics = options[Math.floor(Math.random() * options.length)];
        }
        
        // 根據五行特質調整
        return this.adjustCharacteristicsByElement(baseCharacteristics, dayElement);
    }
    
    /**
     * 獲取階段挑戰
     * @param {Array} months - 月齡範圍
     * @param {string} dayElement - 日主五行
     * @returns {Array} - 挑戰列表
     */
    getStageChallenges(months, dayElement) {
        const startMonth = months[0];
        let baseChallenges = [];
        
        if (startMonth <= 1) {
            const options = [
                ["日夜顛倒，睡眠週期混亂", "腸絞痛可能，傍晚哭鬧", "餵養困難，含乳不佳", "過度刺激敏感，容易哭鬧"],
                ["體重增長不穩定", "黃疸問題可能持續", "溫度調節能力差", "對環境變化適應困難"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 3) {
            const options = [
                ["睡眠模式不穩定", "開始有分離焦慮", "容易受驚嚇", "需要更多互動刺激"],
                ["白天小睡時間不規律", "對聲音過度敏感", "餵奶時容易分心", "情緒變化快速"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 5) {
            const options = [
                ["開始長牙不適，流口水增加", "翻身後睡眠困擾", "對環境要求提高", "注意力短暫，容易分心"],
                ["手部協調能力發展中", "對新食物可能排斥", "睡眠時間開始減少", "需要更多感官刺激"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 7) {
            const options = [
                ["副食品適應期，可能過敏", "坐立不穩易跌倒", "陌生人焦慮明顯", "探索慾望增強但能力有限"],
                ["開始出現挑食行為", "爬行前的挫折感", "對玩具要求更高", "需要更多安全防護"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        } else if (startMonth <= 9) {
            const options = [
                ["爬行期安全隱患增加", "分離焦慮加劇", "睡眠退化可能出現", "挫折忍受力低"],
                ["對小物品的危險探索", "模仿能力強但判斷力不足", "需要更多社交互動", "情緒表達更複雜"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        } else {
            const options = [
                ["學步期跌倒風險高", "語言表達不足引起挫折", "獨立性與依賴性矛盾", "探索慾強但判斷力不足"],
                ["開始有自我意識但表達有限", "對規則的理解能力有限", "社交技能發展中", "情緒調節能力待發展"]
            ];
            baseChallenges = options[Math.floor(Math.random() * options.length)];
        }
        
        // 根據五行特質調整
        return this.adjustChallengesByElement(baseChallenges, dayElement);
    }
    
    /**
     * 獲取階段照護建議
     * @param {Array} months - 月齡範圍
     * @param {string} dayElement - 日主五行
     * @param {Array} favorable - 有利五行
     * @returns {Array} - 照護建議列表
     */
    getStageCareAdvice(months, dayElement, favorable) {
        const startMonth = months[0];
        let baseAdvice = [];
        
        if (startMonth <= 1) {
            baseAdvice = ["建立規律作息", "提供安全包裹感", "溫柔的聲音安撫", "適當的肌膚接觸"];
        } else if (startMonth <= 3) {
            baseAdvice = ["增加互動遊戲", "提供視覺刺激", "建立睡前儀式", "回應寶寶的社交信號"];
        } else if (startMonth <= 5) {
            baseAdvice = ["提供安全的探索環境", "適當的感官刺激", "支持翻身練習", "建立固定的日常節奏"];
        } else if (startMonth <= 7) {
            baseAdvice = ["循序漸進添加副食品", "提供坐立支撐", "建立信任感", "豐富的語言輸入"];
        } else if (startMonth <= 9) {
            baseAdvice = ["確保爬行環境安全", "提供適當挑戰", "保持一致的照護者", "鼓勵探索但設定界限"];
        } else {
            baseAdvice = ["提供學步支持", "豐富語言環境", "平衡獨立與協助", "建立安全探索區域"];
        }
        
        // 根據五行特質調整
        return this.adjustAdviceByElement(baseAdvice, dayElement, favorable);
    }
    
    /**
     * 根據五行調整特色
     */
    adjustCharacteristicsByElement(characteristics, dayElement) {
        const elementAdjustments = {
            '木': ["成長發育較快，身高體重增長明顯", "對自然環境敏感，喜歡戶外活動", "好奇心強，喜歡探索新事物"],
            '火': ["情緒表達豐富，笑聲爽朗", "活動力較強，精力充沛", "對光線和色彩敏感，喜歡明亮環境"],
            '土': ["性情較為穩定，不易哭鬧", "適應力強，容易建立規律作息", "喜歡穩定的環境和熟悉的照護者"],
            '金': ["作息規律性佳，容易養成習慣", "對秩序敏感，喜歡整潔環境", "反應敏銳，學習能力強"],
            '水': ["直覺敏銳，對情緒變化敏感", "情感豐富，需要更多安撫", "睡眠較深，但容易受環境影響"]
        };
        
        // 隨機選擇2-3個特質，增加個性化
        const adjustments = elementAdjustments[dayElement];
        const selectedAdjustments = adjustments.slice(0, Math.floor(Math.random() * 2) + 2);
        
        return [...characteristics, ...selectedAdjustments];
    }
    
    /**
     * 根據五行調整挑戰
     */
    adjustChallengesByElement(challenges, dayElement) {
        const elementChallenges = {
            '木': ["成長速度不一致可能帶來生長痛", "精力旺盛難以安靜", "對束縛感到不適"],
            '火': ["情緒起伏較大，哭鬧激烈", "容易過度刺激影響睡眠", "對溫度變化敏感"],
            '土': ["變化適應需要更長時間", "可能出現固執行為", "食慾不穩定傾向"],
            '金': ["對環境變化非常敏感", "完美主義造成焦慮", "對噪音不耐受"],
            '水': ["情緒感受深刻，需要更多安撫", "睡眠容易受干擾", "對照護者情緒敏感"]
        };
        
        // 隨機選擇1-2個挑戰，增加個性化
        const adjustments = elementChallenges[dayElement];
        const selectedAdjustments = adjustments.slice(0, Math.floor(Math.random() * 2) + 1);
        
        return [...challenges, ...selectedAdjustments];
    }
    
    /**
     * 根據五行調整建議
     */
    adjustAdviceByElement(advice, dayElement, favorable) {
        const elementAdvice = {
            '木': ["提供充足的自然光線和綠色植物", "增加戶外活動時間", "使用天然材質的玩具", "鼓勵自由探索但設定安全界限"],
            '火': ["保持環境溫暖但通風良好", "提供豐富的色彩和視覺刺激", "使用柔和的燈光避免過度刺激", "建立規律的活動和休息時間"],
            '土': ["維持穩定的環境和作息時間", "給予充分的安全感和擁抱", "逐步引入新事物避免突然變化", "提供質地豐富的觸覺體驗"],
            '金': ["保持環境整潔有序", "建立清晰的日常規律和儀式感", "使用柔軟的音樂和聲音", "提供精緻的感官體驗"],
            '水': ["提供安靜舒適的環境", "注重情感連結和溫柔互動", "使用流動的音樂或白噪音", "保持適當的濕度和溫度"]
        };
        
        // 根據有利五行調整建議強度
        let selectedAdvice = elementAdvice[dayElement];
        if (favorable && favorable.includes(dayElement)) {
            // 如果是有利五行，選擇更多建議
            selectedAdvice = selectedAdvice.slice(0, 3);
        } else {
            // 否則選擇基本建議
            selectedAdvice = selectedAdvice.slice(0, 2);
        }
        
        return [...advice, ...selectedAdvice];
    }
    
    /**
     * 生成月份指南 (保留原有功能)
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {number} age - 年齡 (0-10)
     * @returns {Array} - 月份指南
     */
    generateMonthlyGuide(bazi, elementAnalysis, age) {
        const monthlyGuide = [];
        const dayElement = elementAnalysis.dayElement;
        const favorable = elementAnalysis.favorable;
        
        for (let month = 1; month <= 12; month++) {
            let advice = "";
            let focus = "";
            
            // 根據月份的五行特性給出建議
            const monthElement = this.getMonthElement(month);
            
            // 根據年齡段調整建議內容
            if (age <= 3) {
                // 0-3歲
                focus = this.getEarlyChildhoodMonthlyFocus(month, dayElement, favorable.includes(monthElement));
                advice = this.getEarlyChildhoodMonthlyAdvice(month, dayElement, favorable.includes(monthElement));
            } else if (age <= 6) {
                // 4-6歲
                focus = this.getPreschoolMonthlyFocus(month, dayElement, favorable.includes(monthElement));
                advice = this.getPreschoolMonthlyAdvice(month, dayElement, favorable.includes(monthElement));
            } else {
                // 7-10歲
                focus = this.getElementaryMonthlyFocus(month, dayElement, favorable.includes(monthElement));
                advice = this.getElementaryMonthlyAdvice(month, dayElement, favorable.includes(monthElement));
            }
            
            monthlyGuide.push({
                month,
                monthName: this.getMonthName(month),
                element: monthElement,
                focus,
                advice
            });
        }
        
        return monthlyGuide;
    }

    /**
     * 獲取月份對應的五行
     * @param {number} month - 月份 (1-12)
     * @returns {string} - 五行
     */
    getMonthElement(month) {
        const elements = {
            1: '水', 2: '水',  // 冬季：水
            3: '木', 4: '木', 5: '木',  // 春季：木
            6: '火', 7: '火', 8: '火',  // 夏季：火
            9: '金', 10: '金', 11: '金', 12: '金'  // 秋季：金
        };
        
        return elements[month] || '土';
    }

    /**
     * 獲取月份名稱
     * @param {number} month - 月份 (1-12)
     * @returns {string} - 月份名稱
     */
    getMonthName(month) {
        const names = [
            "一月", "二月", "三月", "四月", "五月", "六月",
            "七月", "八月", "九月", "十月", "十一月", "十二月"
        ];
        
        return names[month - 1];
    }

    /**
     * 獲取0-3歲月份重點
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份重點
     */
    getEarlyChildhoodMonthlyFocus(month, dayElement, isFavorable) {
        const focuses = {
            1: "保暖與免疫力",
            2: "情緒穩定與安全感",
            3: "感官刺激與探索",
            4: "運動發展與戶外活動",
            5: "語言發展與互動",
            6: "社交啟蒙與情緒表達",
            7: "創意啟發與想像力",
            8: "自主性培養與嘗試",
            9: "規律作息與習慣養成",
            10: "認知發展與學習",
            11: "親子關係與依附",
            12: "適應能力與轉變"
        };
        
        return focuses[month];
    }

    /**
     * 獲取0-3歲月份建議
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份建議
     */
    getEarlyChildhoodMonthlyAdvice(month, dayElement, isFavorable) {
        let baseAdvice = "";
        
        switch (month) {
            case 1:
            case 2:
                baseAdvice = "冬季注意保暖，增強免疫力，多進行室內親子互動，培養安全感。";
                break;
            case 3:
            case 4:
            case 5:
                baseAdvice = "春季適合戶外活動，接觸自然，促進感官發展和運動能力。";
                break;
            case 6:
            case 7:
            case 8:
                baseAdvice = "夏季注意防暑，適合水上活動，培養社交能力和創造力。";
                break;
            case 9:
            case 10:
            case 11:
            case 12:
                baseAdvice = "秋季適合建立規律作息，培養專注力和學習習慣。";
                break;
        }
        
        // 根據日主和月份五行關係調整建議
        if (isFavorable) {
            baseAdvice += ` 這個月對${dayElement}性寶寶較為有利，可以多安排有助於發展的活動。`;
        } else {
            baseAdvice += ` 這個月對${dayElement}性寶寶可能有些挑戰，需要更多關注和調整。`;
        }
        
        return baseAdvice;
    }

    /**
     * 獲取4-6歲月份重點
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份重點
     */
    getPreschoolMonthlyFocus(month, dayElement, isFavorable) {
        const focuses = {
            1: "專注力與耐心",
            2: "情緒管理與表達",
            3: "創意思維與想像力",
            4: "自然探索與環保意識",
            5: "社交能力與合作",
            6: "表達能力與自信心",
            7: "獨立性與自理能力",
            8: "好奇心與學習興趣",
            9: "規則意識與紀律",
            10: "邏輯思維與問題解決",
            11: "文化認同與傳統",
            12: "適應能力與變通"
        };
        
        return focuses[month];
    }

    /**
     * 獲取4-6歲月份建議
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份建議
     */
    getPreschoolMonthlyAdvice(month, dayElement, isFavorable) {
        let baseAdvice = "";
        
        switch (month) {
            case 1:
            case 2:
                baseAdvice = "冬季適合室內認知活動，培養專注力和情緒管理能力。";
                break;
            case 3:
            case 4:
            case 5:
                baseAdvice = "春季適合自然探索和戶外學習，培養創造力和社交能力。";
                break;
            case 6:
            case 7:
            case 8:
                baseAdvice = "夏季適合藝術表達和獨立訓練，培養自信心和自理能力。";
                break;
            case 9:
            case 10:
            case 11:
            case 12:
                baseAdvice = "秋季適合建立學習習慣和規則意識，培養邏輯思維。";
                break;
        }
        
        // 根據日主和月份五行關係調整建議
        if (isFavorable) {
            baseAdvice += ` 這個月對${dayElement}性寶寶較為有利，可以重點發展相關能力。`;
        } else {
            baseAdvice += ` 這個月對${dayElement}性寶寶可能有些挑戰，需要更多引導和支持。`;
        }
        
        return baseAdvice;
    }

    /**
     * 獲取7-10歲月份重點
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份重點
     */
    getElementaryMonthlyFocus(month, dayElement, isFavorable) {
        const focuses = {
            1: "學習紀律與時間管理",
            2: "情緒智商與人際關係",
            3: "創新思維與解決問題",
            4: "環境意識與責任感",
            5: "團隊合作與領導力",
            6: "表達能力與公開演講",
            7: "獨立思考與批判性思維",
            8: "學習動機與興趣培養",
            9: "自律能力與目標設定",
            10: "邏輯分析與科學思維",
            11: "文化理解與全球視野",
            12: "適應變化與抗壓能力"
        };
        
        return focuses[month];
    }

    /**
     * 獲取7-10歲月份建議
     * @param {number} month - 月份 (1-12)
     * @param {string} dayElement - 日主五行
     * @param {boolean} isFavorable - 是否為有利月份
     * @returns {string} - 月份建議
     */
    getElementaryMonthlyAdvice(month, dayElement, isFavorable) {
        let baseAdvice = "";
        
        switch (month) {
            case 1:
            case 2:
                baseAdvice = "冬季適合培養學習紀律和情緒管理，建立良好的學習習慣。";
                break;
            case 3:
            case 4:
            case 5:
                baseAdvice = "春季適合發展創新思維和團隊合作，參與戶外和社區活動。";
                break;
            case 6:
            case 7:
            case 8:
                baseAdvice = "夏季適合培養表達能力和獨立思考，參與夏令營和特長培訓。";
                break;
            case 9:
            case 10:
            case 11:
            case 12:
                baseAdvice = "秋季適合培養自律能力和邏輯思維，設定學習目標和計劃。";
                break;
        }
        
        // 根據日主和月份五行關係調整建議
        if (isFavorable) {
            baseAdvice += ` 這個月對${dayElement}性寶寶較為有利，可以挑戰更高難度的任務和學習。`;
        } else {
            baseAdvice += ` 這個月對${dayElement}性寶寶可能有些挑戰，需要更多鼓勵和指導。`;
        }
        
        return baseAdvice;
    }
}

// 導出八字計算器
const baziCalculator = new BaziCalculator();