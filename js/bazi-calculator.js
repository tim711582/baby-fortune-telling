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
        // 簡化計算，實際應考慮節氣
        const yearStem = (year - 4) % 10;
        let monthStem = (yearStem * 2 + month) % 10;
        const monthBranch = (month + 1) % 12;
        
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
        // 簡化計算，實際應使用更準確的算法
        // 基準日期：1900年1月1日，天干地支：庚子
        const baseDate = new Date(1900, 0, 1);
        const targetDate = new Date(year, month - 1, day);
        const diffDays = Math.floor((targetDate - baseDate) / (24 * 60 * 60 * 1000));
        
        const stemIndex = (diffDays + 6) % 10; // 6是庚的索引
        const branchIndex = (diffDays + 0) % 12; // 0是子的索引
        
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
        
        // 計算時柱天干
        const hourStemIndex = (dayStemIndex * 2 + hourBranchIndex) % 10;
        const hourStem = this.heavenlyStems[hourStemIndex];
        
        return hourStem + hourBranch;
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
    analyzePersonality(bazi, elementAnalysis) {
        const traits = [];
        const details = [];
        
        // 根據日主五行分析基本性格
        const dayElement = elementAnalysis.dayElement;
        
        switch (dayElement) {
            case "木":
                traits.push("仁愛", "正直", "進取", "創新");
                details.push("木主仁，性格溫和有愛心，重視家庭與人際關係。");
                details.push("具有理想主義傾向，追求成長與發展，喜歡新事物。");
                details.push("有組織能力和領導才能，但可能固執己見。");
                break;
            case "火":
                traits.push("熱情", "活力", "表達力強", "直覺敏銳");
                details.push("火主禮，性格熱情開朗，善於表達與社交。");
                details.push("具有創造力和想像力，反應快速，直覺敏銳。");
                details.push("情緒波動較大，容易衝動，需注意穩定性。");
                break;
            case "土":
                traits.push("穩重", "踏實", "忠誠", "包容");
                details.push("土主信，性格穩重踏實，值得信賴。");
                details.push("重視家庭和傳統，有責任感和使命感。");
                details.push("做事謹慎，講求實際，但可能過於保守。");
                break;
            case "金":
                traits.push("果斷", "公正", "自律", "精確");
                details.push("金主義，性格剛毅果斷，重視公平與正義。");
                details.push("做事有條理，追求完美，注重細節。");
                details.push("自律性強，但可能過於嚴格，不夠靈活。");
                break;
            case "水":
                traits.push("聰明", "靈活", "適應力強", "深思熟慮");
                details.push("水主智，思維靈活，學習能力強，適應性好。");
                details.push("善於溝通和理解，有哲學思考傾向。");
                details.push("情感豐富但內斂，處事圓滑但可能優柔寡斷。");
                break;
        }
        
        // 根據五行強弱分析性格傾向
        if (elementAnalysis.dayElementStrength === "強") {
            traits.push("自信", "主動", "獨立");
            details.push(`日主${dayElement}強，性格較為自信主動，有獨立精神和主見。`);
        } else if (elementAnalysis.dayElementStrength === "弱") {
            traits.push("謙和", "順應", "靈活");
            details.push(`日主${dayElement}弱，性格較為謙和，善於順應環境，靈活變通。`);
        } else {
            traits.push("平衡", "中庸");
            details.push(`日主${dayElement}中和，性格較為平衡，能夠中庸處世。`);
        }
        
        // 分析地支組合
        const branches = [
            bazi.yearPillar.charAt(1),
            bazi.monthPillar.charAt(1),
            bazi.dayPillar.charAt(1),
            bazi.hourPillar.charAt(1)
        ];
        
        // 檢查是否有三合
        const woodCombination = ['寅', '卯', '辰'];
        const fireCombination = ['巳', '午', '未'];
        const metalCombination = ['申', '酉', '戌'];
        const waterCombination = ['亥', '子', '丑'];
        
        const combinations = [woodCombination, fireCombination, metalCombination, waterCombination];
        const combinationNames = ['木局', '火局', '金局', '水局'];
        
        for (let i = 0; i < combinations.length; i++) {
            const combo = combinations[i];
            const count = branches.filter(branch => combo.includes(branch)).length;
            
            if (count >= 2) {
                traits.push(combinationNames[i]);
                details.push(`八字中有${combinationNames[i]}傾向，增強相關五行特質。`);
            }
        }
        
        return {
            traits,
            details
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
     * 生成月份指南
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