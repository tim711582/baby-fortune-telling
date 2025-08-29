/**
 * 分析模組 - 處理八字分析結果並與GPT API整合
 */

class BaziAnalysis {
    constructor() {
        this.apiKey = null; // 用戶需要自行設置API金鑰
        this.apiEndpoint = 'https://api.openai.com/v1/chat/completions';
        this.loadApiKey();
    }

    /**
     * 從localStorage載入API金鑰
     */
    loadApiKey() {
        const savedKey = localStorage.getItem('openai_api_key');
        if (savedKey) {
            this.apiKey = savedKey;
        }
    }

    /**
     * 更新API金鑰
     * @param {string} key - 新的API金鑰
     */
    updateApiKey(key) {
        this.apiKey = key;
    }

    /**
     * 設置API金鑰
     * @param {string} key - API金鑰
     */
    setApiKey(key) {
        this.apiKey = key;
        // 儲存到localStorage，方便下次使用
        localStorage.setItem('gpt_api_key', key);
    }

    /**
     * 從localStorage獲取API金鑰
     * @returns {string} - API金鑰
     */
    getApiKey() {
        return localStorage.getItem('gpt_api_key') || this.apiKey;
    }

    /**
     * 檢查是否已設置API金鑰
     * @returns {boolean} - 是否已設置API金鑰
     */
    hasApiKey() {
        return !!this.getApiKey();
    }

    /**
     * 生成整體分析
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @returns {string} - 整體分析文字
     */
    generateOverallAnalysis(bazi, elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const dayElementStrength = elementAnalysis.dayElementStrength;
        const favorable = elementAnalysis.favorable.join('、');
        const unfavorable = elementAnalysis.unfavorable.join('、');
        
        let analysis = `這位寶寶八字日主為${dayElement}，五行${dayElementStrength}。`;
        analysis += `\n\n根據八字分析，有利五行為${favorable}，不利五行為${unfavorable}。`;
        
        // 分析納音
        const naYin = baziCalculator.analyzeNaYin(bazi);
        analysis += `\n\n年柱納音為${naYin.yearNaYin}，月柱納音為${naYin.monthNaYin}，日柱納音為${naYin.dayNaYin}，時柱納音為${naYin.hourNaYin}。`;
        
        // 根據日主五行給出整體建議
        switch (dayElement) {
            case "木":
                analysis += `\n\n木主仁，代表成長、發展和創新。這位寶寶天生具有活力和進取心，喜歡探索和學習新事物。在成長過程中，需要給予足夠的自由空間和鼓勵，同時也要培養耐心和專注力。`;
                break;
            case "火":
                analysis += `\n\n火主禮，代表熱情、活力和表達。這位寶寶天生具有熱情和創造力，善於表達和社交。在成長過程中，需要幫助調節情緒和能量，培養專注力和持久力。`;
                break;
            case "土":
                analysis += `\n\n土主信，代表穩重、踏實和包容。這位寶寶天生具有責任感和可靠性，重視家庭和傳統。在成長過程中，需要鼓勵嘗試新事物，培養靈活性和創造力。`;
                break;
            case "金":
                analysis += `\n\n金主義，代表果斷、公正和自律。這位寶寶天生具有條理性和判斷力，做事認真負責。在成長過程中，需要培養情感表達和靈活性，避免過於嚴格和固執。`;
                break;
            case "水":
                analysis += `\n\n水主智，代表智慧、靈活和適應力。這位寶寶天生具有思考能力和適應性，善於理解和溝通。在成長過程中，需要培養執行力和堅持性，避免過於猶豫不決。`;
                break;
        }
        
        return analysis;
    }

    /**
     * 使用GPT API生成深度分析
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {string} analysisType - 分析類型 (personality, growth, education, etc.)
     * @returns {Promise<string>} - 分析結果
     */
    async generateGptAnalysis(bazi, elementAnalysis, analysisType) {
        if (!this.hasApiKey()) {
            return '請先設置GPT API金鑰以獲取深度分析。';
        }
        
        try {
            const prompt = this.createPrompt(bazi, elementAnalysis, analysisType);
            const response = await this.callGptApi(prompt);
            return response;
        } catch (error) {
            console.error('GPT API調用失敗:', error);
            return `分析生成失敗: ${error.message}`;
        }
    }

    /**
     * 創建GPT API的提示詞
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {string} analysisType - 分析類型
     * @returns {string} - 提示詞
     */
    createPrompt(bazi, elementAnalysis, analysisType) {
        const baziInfo = `八字: ${bazi.yearPillar} ${bazi.monthPillar} ${bazi.dayPillar} ${bazi.hourPillar}`;
        const elementInfo = `日主五行: ${elementAnalysis.dayElement}, 強度: ${elementAnalysis.dayElementStrength}, 喜用神: ${elementAnalysis.favorable.join('、')}, 忌神: ${elementAnalysis.unfavorable.join('、')}`;
        
        let prompt = '';
        
        switch (analysisType) {
            case 'personality':
                prompt = `根據以下八字信息，分析這位寶寶的性格特質、優勢和潛在挑戰，以及如何根據這些特質進行教育和引導。\n\n${baziInfo}\n${elementInfo}\n\n請提供詳細的性格分析，包括主要特質、情緒傾向、學習風格、人際關係特點等方面。分析應該具體、實用，並提供針對性的教育建議。`;
                break;
            case 'growth':
                prompt = `根據以下八字信息，分析這位寶寶在0-10歲各個成長階段的特點、挑戰和機遇，以及如何根據八字特質進行有針對性的培養。\n\n${baziInfo}\n${elementInfo}\n\n請分析0-3歲、4-6歲、7-10歲三個階段的成長特點，包括身心發展、學習能力、社交能力等方面，並提供具體的教育和培養建議。`;
                break;
            case 'education':
                prompt = `根據以下八字信息，分析這位寶寶的學習特點、適合的教育方式和可能的學習挑戰，以及如何根據八字特質進行有針對性的教育引導。\n\n${baziInfo}\n${elementInfo}\n\n請提供詳細的學習風格分析，包括認知方式、注意力特點、學習動機等方面，並提供具體的教育策略和方法建議。`;
                break;
            case 'health':
                prompt = `根據以下八字信息，分析這位寶寶的體質特點、可能的健康優勢和需要注意的健康問題，以及如何根據八字特質進行有針對性的健康管理。\n\n${baziInfo}\n${elementInfo}\n\n請提供詳細的體質分析，包括先天稟賦、免疫力特點、可能的敏感點等方面，並提供具體的健康管理和預防建議。`;
                break;
            default:
                prompt = `根據以下八字信息，進行全面分析，包括性格特質、成長發展、教育方式和健康管理等方面。\n\n${baziInfo}\n${elementInfo}\n\n請提供詳細、實用的分析和建議，幫助家長更好地理解和培養孩子。`;
        }
        
        return prompt;
    }

    /**
     * 根據八字分析更新年齡階段性格特點
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     */
    updateAgeStageTraits(bazi, elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        const dayElementStrength = elementAnalysis.dayElementStrength;
        
        // 根據日主五行更新各階段特點
        this.updateStageTraits('0-2', dayElement, dayElementStrength);
        this.updateStageTraits('3-5', dayElement, dayElementStrength);
        this.updateStageTraits('6-8', dayElement, dayElementStrength);
        this.updateStageTraits('9-10', dayElement, dayElementStrength);
    }

    /**
     * 更新特定階段的性格特點
     * @param {string} stage - 年齡階段
     * @param {string} dayElement - 日主五行
     * @param {string} strength - 五行強度
     */
    updateStageTraits(stage, dayElement, strength) {
        const traitsElement = document.getElementById(`traits-${stage}`);
        if (!traitsElement) return;

        let traits = [];
        
        // 根據不同階段和五行特點生成性格特點
        switch (stage) {
            case '0-2':
                traits = this.getInfantTraits(dayElement, strength);
                break;
            case '3-5':
                traits = this.getPreschoolTraits(dayElement, strength);
                break;
            case '6-8':
                traits = this.getEarlySchoolTraits(dayElement, strength);
                break;
            case '9-10':
                traits = this.getMiddleSchoolTraits(dayElement, strength);
                break;
        }
        
        // 更新HTML內容
        traitsElement.innerHTML = traits.map(trait => `<li>${trait}</li>`).join('');
    }

    /**
     * 獲取嬰幼兒期性格特點
     */
    getInfantTraits(dayElement, strength) {
        const baseTraits = [
            '天生氣質較為敏感，對環境變化反應明顯',
            '情緒表達直接，哭鬧時需要耐心安撫',
            '對聲音和光線較為敏感，需要溫和的環境',
            '依賴性強，需要充分的安全感'
        ];
        
        switch (dayElement) {
            case '木':
                return [...baseTraits, '活潑好動，精力充沛，需要足夠的活動空間'];
            case '火':
                return [...baseTraits, '情緒變化快，表達能力強，喜歡與人互動'];
            case '土':
                return [...baseTraits, '性格溫和穩定，適應能力較強，容易建立規律'];
            case '金':
                return [...baseTraits, '反應敏銳，對規律性要求高，喜歡清潔整齊的環境'];
            case '水':
                return [...baseTraits, '聰明靈活，學習能力強，但可能較為敏感'];
            default:
                return baseTraits;
        }
    }

    /**
     * 獲取學前期性格特點
     */
    getPreschoolTraits(dayElement, strength) {
        const baseTraits = [
            '好奇心旺盛，喜歡探索和提問',
            '想像力豐富，創造力開始顯現',
            '情緒波動較大，需要學習情緒管理',
            '開始展現獨立性，但仍需要指導'
        ];
        
        switch (dayElement) {
            case '木':
                return [...baseTraits, '喜歡戶外活動，對自然事物特別感興趣'];
            case '火':
                return [...baseTraits, '表達欲強，喜歡表演和展示，社交能力發展快'];
            case '土':
                return [...baseTraits, '做事認真負責，喜歡幫助他人，有強烈的歸屬感'];
            case '金':
                return [...baseTraits, '邏輯思維能力強，喜歡規則和秩序，做事有條理'];
            case '水':
                return [...baseTraits, '適應能力強，學習新事物快，但可能缺乏持久力'];
            default:
                return baseTraits;
        }
    }

    /**
     * 獲取學齡初期性格特點
     */
    getEarlySchoolTraits(dayElement, strength) {
        const baseTraits = [
            '學習能力強，對知識有渴望',
            '社交能力發展，開始建立友誼',
            '責任感逐漸形成，能承擔簡單任務',
            '自我意識增強，開始有自己的想法'
        ];
        
        switch (dayElement) {
            case '木':
                return [...baseTraits, '創新思維活躍，喜歡嘗試新方法解決問題'];
            case '火':
                return [...baseTraits, '領導能力強，喜歡組織活動，但需要學習耐心'];
            case '土':
                return [...baseTraits, '學習踏實認真，記憶力好，但可能缺乏創新思維'];
            case '金':
                return [...baseTraits, '分析能力強，做事有計劃，但可能過於追求完美'];
            case '水':
                return [...baseTraits, '理解能力強，善於溝通，但可能缺乏堅持性'];
            default:
                return baseTraits;
        }
    }

    /**
     * 獲取學齡中期性格特點
     */
    getMiddleSchoolTraits(dayElement, strength) {
        const baseTraits = [
            '邏輯思維能力增強，能理解複雜概念',
            '價值觀開始形成，對公平正義有概念',
            '同儕關係重要性增加',
            '開始關注自己的能力和表現'
        ];
        
        switch (dayElement) {
            case '木':
                return [...baseTraits, '具有開拓精神，喜歡挑戰，但需要學習堅持'];
            case '火':
                return [...baseTraits, '熱情積極，善於激勵他人，但需要控制衝動'];
            case '土':
                return [...baseTraits, '穩重可靠，有強烈的責任感，但可能過於保守'];
            case '金':
                return [...baseTraits, '原則性強，有正義感，但可能過於嚴格'];
            case '水':
                return [...baseTraits, '思維靈活，善於變通，但可能缺乏原則性'];
            default:
                return baseTraits;
        }
    }

    /**
     * 更新教育和健康建議
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     */
    updateEducationAndHealthAdvice(bazi, elementAnalysis) {
        this.updateLearningStyle(elementAnalysis);
        this.updateCommunicationStyle(elementAnalysis);
        this.updateInterestDevelopment(elementAnalysis);
        this.updateHealthAdvice(elementAnalysis);
    }

    /**
     * 更新學習方式建議
     */
    updateLearningStyle(elementAnalysis) {
        const element = document.getElementById('learningStyle');
        if (!element) return;
        
        const dayElement = elementAnalysis.dayElement;
        let content = '<p>根據八字分析，建議採用以下學習方式：</p><ul>';
        
        switch (dayElement) {
            case '木':
                content += '<li>體驗式學習：通過實際操作和體驗來學習</li>';
                content += '<li>戶外學習：結合自然環境進行學習</li>';
                content += '<li>創新思維：鼓勵創新和獨立思考</li>';
                break;
            case '火':
                content += '<li>互動式學習：通過討論和交流來學習</li>';
                content += '<li>視覺學習：使用圖表、圖片和色彩豐富的教材</li>';
                content += '<li>表演學習：通過角色扮演和表演來學習</li>';
                break;
            case '土':
                content += '<li>循序漸進：按部就班，不急於求成</li>';
                content += '<li>重複練習：通過反覆練習來鞏固知識</li>';
                content += '<li>實用導向：注重知識的實際應用</li>';
                break;
            case '金':
                content += '<li>邏輯學習：注重邏輯推理和分析</li>';
                content += '<li>結構化學習：建立清晰的知識結構</li>';
                content += '<li>精確學習：注重細節和準確性</li>';
                break;
            case '水':
                content += '<li>靈活學習：採用多種學習方法</li>';
                content += '<li>聯想學習：通過聯想和類比來學習</li>';
                content += '<li>適應性學習：根據情況調整學習策略</li>';
                break;
        }
        
        content += '</ul>';
        element.innerHTML = content;
    }

    /**
     * 更新溝通方式建議
     */
    updateCommunicationStyle(elementAnalysis) {
        const element = document.getElementById('communicationStyle');
        if (!element) return;
        
        const dayElement = elementAnalysis.dayElement;
        let content = '<p>與孩子溝通時建議：</p><ul>';
        
        switch (dayElement) {
            case '木':
                content += '<li>給予充分的自由和空間表達</li>';
                content += '<li>鼓勵創新思維和獨立見解</li>';
                content += '<li>避免過度限制和約束</li>';
                break;
            case '火':
                content += '<li>保持熱情和積極的態度</li>';
                content += '<li>及時給予回應和互動</li>';
                content += '<li>幫助控制情緒和衝動</li>';
                break;
            case '土':
                content += '<li>耐心傾聽，給予充分的表達機會</li>';
                content += '<li>使用溫和穩定的語調</li>';
                content += '<li>建立信任和安全感</li>';
                break;
            case '金':
                content += '<li>邏輯清晰，條理分明</li>';
                content += '<li>設定清晰的界限和期望</li>';
                content += '<li>尊重孩子的原則和標準</li>';
                break;
            case '水':
                content += '<li>靈活調整溝通方式</li>';
                content += '<li>善於引導和啟發</li>';
                content += '<li>避免過於強硬的態度</li>';
                break;
        }
        
        content += '</ul>';
        element.innerHTML = content;
    }

    /**
     * 更新興趣培養建議
     */
    updateInterestDevelopment(elementAnalysis) {
        const element = document.getElementById('interestDevelopment');
        if (!element) return;
        
        const dayElement = elementAnalysis.dayElement;
        let content = '<p>建議培養的興趣方向：</p><ul>';
        
        switch (dayElement) {
            case '木':
                content += '<li>自然探索：園藝、生物觀察、戶外活動</li>';
                content += '<li>創意藝術：繪畫、手工、設計</li>';
                content += '<li>體育運動：跑步、攀岩、球類運動</li>';
                break;
            case '火':
                content += '<li>表演藝術：舞蹈、戲劇、演講</li>';
                content += '<li>社交活動：團隊運動、社團活動</li>';
                content += '<li>創作表達：寫作、音樂、攝影</li>';
                break;
            case '土':
                content += '<li>實用技能：烹飪、手工、建築模型</li>';
                content += '<li>收藏整理：郵票、書籍、模型</li>';
                content += '<li>服務活動：志願服務、幫助他人</li>';
                break;
            case '金':
                content += '<li>邏輯思維：數學、編程、棋類</li>';
                content += '<li>精密技能：樂器、書法、繪畫</li>';
                content += '<li>競技運動：武術、體操、射擊</li>';
                break;
            case '水':
                content += '<li>語言學習：外語、文學、演講</li>';
                content += '<li>水上運動：游泳、划船、衝浪</li>';
                content += '<li>智力遊戲：圍棋、象棋、益智遊戲</li>';
                break;
        }
        
        content += '</ul>';
        element.innerHTML = content;
    }

    /**
     * 更新健康建議
     */
    updateHealthAdvice(elementAnalysis) {
        const dayElement = elementAnalysis.dayElement;
        
        // 更新體質特點
        const constitutionElement = document.getElementById('physicalConstitution');
        if (constitutionElement) {
            let constitutionText = '';
            switch (dayElement) {
                case '木':
                    constitutionText = '體質特點：肝膽系統較為敏感，容易緊張和焦慮。建議多進行戶外活動，保持心情愉快，避免過度壓力。';
                    break;
                case '火':
                    constitutionText = '體質特點：心血管系統活躍，精力充沛但容易上火。建議保持規律作息，避免過度興奮，注意心理平衡。';
                    break;
                case '土':
                    constitutionText = '體質特點：脾胃系統穩定，消化能力較好但可能偏胖。建議均衡飲食，適量運動，避免暴飲暴食。';
                    break;
                case '金':
                    constitutionText = '體質特點：肺部系統敏感，呼吸道較為脆弱。建議保持空氣清新，避免污染環境，注意呼吸道保護。';
                    break;
                case '水':
                    constitutionText = '體質特點：腎臟系統較為敏感，水液代謝活躍。建議保持充足睡眠，避免過度勞累，注意腰腎保護。';
                    break;
            }
            constitutionElement.innerHTML = `<p>${constitutionText}</p>`;
        }
        
        // 更新飲食建議
        const dietElement = document.getElementById('dietaryAdvice');
        if (dietElement) {
            let dietText = '';
            switch (dayElement) {
                case '木':
                    dietText = '飲食建議：多吃綠色蔬菜和酸味食物，如菠菜、青椒、檸檬等。避免過於油膩和辛辣的食物。';
                    break;
                case '火':
                    dietText = '飲食建議：多吃紅色食物和苦味食物，如番茄、紅棗、苦瓜等。避免過於寒涼和生冷的食物。';
                    break;
                case '土':
                    dietText = '飲食建議：多吃黃色食物和甘味食物，如南瓜、玉米、蜂蜜等。避免過於油膩和難消化的食物。';
                    break;
                case '金':
                    dietText = '飲食建議：多吃白色食物和辛味食物，如白蘿蔔、梨子、生薑等。避免過於燥熱和刺激的食物。';
                    break;
                case '水':
                    dietText = '飲食建議：多吃黑色食物和鹹味食物，如黑豆、海帶、核桃等。避免過於溫燥和上火的食物。';
                    break;
            }
            dietElement.innerHTML = `<p>${dietText}</p>`;
        }
        
        // 更新運動建議
        const exerciseElement = document.getElementById('exerciseAdvice');
        if (exerciseElement) {
            let exerciseText = '';
            switch (dayElement) {
                case '木':
                    exerciseText = '運動建議：適合戶外運動和伸展性運動，如跑步、瑜伽、太極等。運動強度適中，重在舒展筋骨。';
                    break;
                case '火':
                    exerciseText = '運動建議：適合有氧運動和團體運動，如游泳、籃球、舞蹈等。注意控制運動強度，避免過度興奮。';
                    break;
                case '土':
                    exerciseText = '運動建議：適合穩定性運動和力量訓練，如散步、舉重、體操等。運動要持之以恆，循序漸進。';
                    break;
                case '金':
                    exerciseText = '運動建議：適合呼吸性運動和精確性運動，如深呼吸、射箭、武術等。注重動作的準確性和規範性。';
                    break;
                case '水':
                    exerciseText = '運動建議：適合流動性運動和水上運動，如游泳、划船、柔軟體操等。運動要靈活多變，避免過於激烈。';
                    break;
            }
            exerciseElement.innerHTML = `<p>${exerciseText}</p>`;
        }
    }

    /**
     * 調用GPT API
     * @param {string} prompt - 提示詞
     * @returns {Promise<string>} - API回應
     */
    async callGptApi(prompt) {
        const apiKey = this.apiKey;
        
        if (!apiKey) {
            throw new Error('未設置API金鑰');
        }
        
        const requestBody = {
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: '你是一位專業的八字命理分析師，專注於兒童成長發展和教育指導。請根據提供的八字信息，給出專業、實用、具體的分析和建議，幫助家長更好地理解和培養孩子。'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 1000
        };
        
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API錯誤: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error('API調用失敗:', error);
            throw error;
        }
    }

    /**
     * 顯示API金鑰設置對話框
     */
    showApiKeyDialog() {
        // 創建對話框元素
        const dialog = document.createElement('div');
        dialog.className = 'api-key-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <h3>設置GPT API金鑰</h3>
                <p>請輸入您的OpenAI API金鑰以啟用深度分析功能</p>
                <input type="password" id="apiKeyInput" placeholder="sk-..." value="${this.getApiKey() || ''}">
                <div class="dialog-buttons">
                    <button id="cancelApiKey">取消</button>
                    <button id="saveApiKey">保存</button>
                </div>
            </div>
        `;
        
        // 添加樣式
        const style = document.createElement('style');
        style.textContent = `
            .api-key-dialog {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
            }
            .dialog-content {
                background-color: white;
                padding: 2rem;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                width: 90%;
                max-width: 500px;
            }
            .dialog-content h3 {
                margin-top: 0;
                color: var(--primary-color);
            }
            .dialog-content input {
                width: 100%;
                padding: 0.8rem;
                margin: 1rem 0;
                border: 1px solid #ddd;
                border-radius: 4px;
            }
            .dialog-buttons {
                display: flex;
                justify-content: flex-end;
                gap: 1rem;
            }
            .dialog-buttons button {
                padding: 0.6rem 1.2rem;
                border-radius: 4px;
                cursor: pointer;
            }
            #cancelApiKey {
                background-color: #f1f1f1;
                border: 1px solid #ddd;
            }
            #saveApiKey {
                background-color: var(--primary-color);
                color: white;
                border: none;
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(dialog);
        
        // 添加事件監聽器
        document.getElementById('cancelApiKey').addEventListener('click', () => {
            document.body.removeChild(dialog);
        });
        
        document.getElementById('saveApiKey').addEventListener('click', () => {
            const apiKey = document.getElementById('apiKeyInput').value.trim();
            if (apiKey) {
                this.setApiKey(apiKey);
                document.body.removeChild(dialog);
                alert('API金鑰已保存');
            } else {
                alert('請輸入有效的API金鑰');
            }
        });
    }
}

// 創建分析實例
const baziAnalysis = new BaziAnalysis();