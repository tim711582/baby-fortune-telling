/**
 * GPT API 服務模組
 * 負責與OpenAI GPT API通信，生成個性化的八字分析內容
 */
class GPTService {
    constructor() {
        this.apiKey = null;
        this.baseUrl = 'https://api.openai.com/v1/chat/completions';
        this.model = 'gpt-3.5-turbo';
    }

    /**
     * 設置API密鑰
     * @param {string} apiKey - OpenAI API密鑰
     */
    setApiKey(apiKey) {
        this.apiKey = apiKey;
    }

    /**
     * 檢查API密鑰是否已設置
     * @returns {boolean}
     */
    isApiKeySet() {
        return this.apiKey && this.apiKey.trim() !== '';
    }

    /**
     * 生成個性化的性格分析
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {string} babyName - 寶寶姓名
     * @returns {Promise<Object>} - 個性化分析結果
     */
    async generatePersonalityAnalysis(bazi, elementAnalysis, babyName = '寶寶') {
        if (!this.isApiKeySet()) {
            throw new Error('請先設置GPT API密鑰');
        }

        const prompt = this.createPersonalityPrompt(bazi, elementAnalysis, babyName);
        
        try {
            const response = await this.callGPTAPI(prompt);
            return this.parsePersonalityResponse(response);
        } catch (error) {
            console.error('GPT API調用失敗:', error);
            throw new Error('AI分析服務暫時不可用，請稍後再試');
        }
    }

    /**
     * 生成個性化的月齡指南
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {string} babyName - 寶寶姓名
     * @returns {Promise<Array>} - 月齡指南數據
     */
    async generateMonthlyGuide(bazi, elementAnalysis, babyName = '寶寶') {
        if (!this.isApiKeySet()) {
            throw new Error('請先設置GPT API密鑰');
        }

        const prompt = this.createMonthlyGuidePrompt(bazi, elementAnalysis, babyName);
        
        try {
            const response = await this.callGPTAPI(prompt);
            return this.parseMonthlyGuideResponse(response);
        } catch (error) {
            console.error('GPT API調用失敗:', error);
            throw new Error('AI分析服務暫時不可用，請稍後再試');
        }
    }

    /**
     * 生成整體摘要
     * @param {Object} bazi - 八字信息
     * @param {Object} elementAnalysis - 五行分析
     * @param {string} babyName - 寶寶姓名
     * @returns {Promise<Object>} - 整體摘要
     */
    async generateOverallSummary(bazi, elementAnalysis, babyName = '寶寶') {
        if (!this.isApiKeySet()) {
            throw new Error('請先設置GPT API密鑰');
        }

        const prompt = this.createOverallSummaryPrompt(bazi, elementAnalysis, babyName);
        
        try {
            const response = await this.callGPTAPI(prompt);
            return this.parseOverallSummaryResponse(response);
        } catch (error) {
            console.error('GPT API調用失敗:', error);
            throw new Error('AI分析服務暫時不可用，請稍後再試');
        }
    }

    /**
     * 調用GPT API
     * @param {string} prompt - 提示詞
     * @returns {Promise<string>} - API響應
     */
    async callGPTAPI(prompt) {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    {
                        role: 'system',
                        content: '你是一位專業的八字命理師和兒童發展專家，擅長根據八字分析提供個性化的育兒建議。請用繁體中文回答，內容要專業、實用且溫暖。'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            throw new Error(`API請求失敗: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * 創建性格分析提示詞
     */
    createPersonalityPrompt(bazi, elementAnalysis, babyName) {
        return `請根據以下八字信息為${babyName}提供個性化的性格分析：

八字信息：
- 年柱：${bazi.year}
- 月柱：${bazi.month}
- 日柱：${bazi.day}
- 時柱：${bazi.hour}

五行分析：
- 日主五行：${elementAnalysis.dayElement}
- 五行強弱：${elementAnalysis.strength}
- 有利五行：${elementAnalysis.favorable?.join('、') || '無'}

請提供以下內容（請以JSON格式回答）：
{
  "traits": ["性格標籤1", "性格標籤2", "性格標籤3", "性格標籤4", "性格標籤5"],
  "description": "詳細的性格描述（100-150字）",
  "strengths": ["優勢1", "優勢2", "優勢3"],
  "challenges": ["挑戰1", "挑戰2", "挑戰3"]
}`;
    }

    /**
     * 創建月齡指南提示詞
     */
    createMonthlyGuidePrompt(bazi, elementAnalysis, babyName) {
        return `請根據以下八字信息為${babyName}提供0-12個月的個性化育兒指南：

八字信息：
- 年柱：${bazi.year}
- 月柱：${bazi.month}
- 日柱：${bazi.day}
- 時柱：${bazi.hour}

五行分析：
- 日主五行：${elementAnalysis.dayElement}
- 五行強弱：${elementAnalysis.strength}
- 有利五行：${elementAnalysis.favorable?.join('、') || '無'}

請提供6個階段的指南（0-1月、2-3月、4-5月、6-7月、8-9月、10-12月），每個階段包含：
- 發展特色（3-4個）
- 主要挑戰（2-3個）
- 照護建議（3-4個）

請以JSON格式回答：
{
  "stages": [
    {
      "months": "0-1月",
      "characteristics": ["特色1", "特色2", "特色3"],
      "challenges": ["挑戰1", "挑戰2"],
      "advice": ["建議1", "建議2", "建議3"]
    }
    // ... 其他階段
  ]
}`;
    }

    /**
     * 創建整體摘要提示詞
     */
    createOverallSummaryPrompt(bazi, elementAnalysis, babyName) {
        return `請根據以下八字信息為${babyName}提供0-6歲的整體成長摘要：

八字信息：
- 年柱：${bazi.year}
- 月柱：${bazi.month}
- 日柱：${bazi.day}
- 時柱：${bazi.hour}

五行分析：
- 日主五行：${elementAnalysis.dayElement}
- 五行強弱：${elementAnalysis.strength}
- 有利五行：${elementAnalysis.favorable?.join('、') || '無'}

請提供以下內容（請以JSON格式回答）：
{
  "personalityHighlights": ["性格重點1", "性格重點2", "性格重點3"],
  "ageStages": {
    "infant": "0-2歲階段摘要（50-80字）",
    "toddler": "3-4歲階段摘要（50-80字）",
    "preschool": "5-6歲階段摘要（50-80字）"
  },
  "groupLifeAdvice": ["團體生活建議1", "團體生活建議2", "團體生活建議3"]
}`;
    }

    /**
     * 解析性格分析響應
     */
    parsePersonalityResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('解析GPT響應失敗:', error);
            // 返回默認結構
            return {
                traits: ['溫和', '敏感', '好奇', '活潑', '聰明'],
                description: '根據八字分析，這個寶寶具有獨特的性格特質，需要細心的照護和引導。',
                strengths: ['學習能力強', '適應力佳', '情感豐富'],
                challenges: ['需要更多安全感', '對環境變化敏感', '情緒表達需要引導']
            };
        }
    }

    /**
     * 解析月齡指南響應
     */
    parseMonthlyGuideResponse(response) {
        try {
            const parsed = JSON.parse(response);
            return parsed.stages || [];
        } catch (error) {
            console.error('解析GPT響應失敗:', error);
            return [];
        }
    }

    /**
     * 解析整體摘要響應
     */
    parseOverallSummaryResponse(response) {
        try {
            return JSON.parse(response);
        } catch (error) {
            console.error('解析GPT響應失敗:', error);
            // 返回默認結構
            return {
                personalityHighlights: ['性格溫和', '學習能力強', '需要安全感'],
                ageStages: {
                    infant: '嬰兒期需要充分的愛與關懷，建立安全的依附關係。',
                    toddler: '幼兒期開始展現個性，需要耐心引導和適當的界限設定。',
                    preschool: '學齡前期好奇心旺盛，適合多元化的學習體驗。'
                },
                groupLifeAdvice: ['培養社交技能', '學習分享合作', '建立規則意識']
            };
        }
    }
}

// 創建全局實例
const gptService = new GPTService();