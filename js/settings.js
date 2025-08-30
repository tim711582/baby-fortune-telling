// 設定管理模組
class SettingsManager {
    constructor() {
        this.apiKey = null;
        this.init();
    }

    init() {
        this.loadSettings();
        this.bindEvents();
        this.updateUI();
    }

    // 綁定事件監聽器
    bindEvents() {
        // 設定按鈕點擊事件
        const settingsBtn = document.getElementById('settingsBtn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.openModal();
            });
        }

        // 模態框關閉事件
        const modal = document.getElementById('settingsModal');
        const closeBtn = modal?.querySelector('.close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal());
        }

        // 點擊模態框外部關閉
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        // API 金鑰顯示/隱藏切換
        const toggleBtn = document.getElementById('toggleApiKey');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleApiKeyVisibility());
        }

        // 儲存設定按鈕
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => this.saveSettings());
        }

        // 測試 API 按鈕
        const testBtn = document.getElementById('testApi');
        if (testBtn) {
            testBtn.addEventListener('click', () => this.testApiConnection());
        }

        // 清除設定按鈕
        const clearBtn = document.getElementById('clearSettings');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => this.clearSettings());
        }

        // ESC 鍵關閉模態框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeModal();
            }
        });
    }

    // 載入設定
    loadSettings() {
        try {
            // 載入API密鑰
            this.apiKey = localStorage.getItem('openai_api_key');
            if (this.apiKey && typeof gptService !== 'undefined') {
                gptService.setApiKey(this.apiKey);
            }
            
            // 載入其他設定
            const settingsStr = localStorage.getItem('app_settings');
            if (settingsStr) {
                const settings = JSON.parse(settingsStr);
                
                // 更新UI元素
                const enableGPTCheckbox = document.getElementById('enableGPTAnalysis');
                const showChartsCheckbox = document.getElementById('showCharts');
                const showDetailedAnalysisCheckbox = document.getElementById('showDetailedAnalysis');
                
                if (enableGPTCheckbox) enableGPTCheckbox.checked = settings.enableGPTAnalysis ?? false;
                if (showChartsCheckbox) showChartsCheckbox.checked = settings.showCharts ?? true;
                if (showDetailedAnalysisCheckbox) showDetailedAnalysisCheckbox.checked = settings.showDetailedAnalysis ?? true;
            }
        } catch (error) {
            console.error('載入設定失敗:', error);
        }
    }

    // 更新 UI 狀態
    updateUI() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const apiStatus = document.getElementById('apiStatus');

        if (apiKeyInput && this.apiKey) {
            apiKeyInput.value = this.apiKey;
        }

        if (apiStatus) {
            if (this.apiKey) {
                apiStatus.textContent = '已設定';
                apiStatus.className = 'status-indicator valid';
            } else {
                apiStatus.textContent = '未設定';
                apiStatus.className = 'status-indicator not-set';
            }
        }
    }

    // 開啟模態框
    openModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'block';
            // 聚焦到 API 金鑰輸入框
            const apiKeyInput = document.getElementById('apiKeyInput');
            if (apiKeyInput) {
                setTimeout(() => apiKeyInput.focus(), 100);
            }
        }
    }

    // 關閉模態框
    closeModal() {
        const modal = document.getElementById('settingsModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    // 切換 API 金鑰顯示/隱藏
    toggleApiKeyVisibility() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const toggleBtn = document.getElementById('toggleApiKey');
        const icon = toggleBtn?.querySelector('i');

        if (apiKeyInput && icon) {
            if (apiKeyInput.type === 'password') {
                apiKeyInput.type = 'text';
                icon.className = 'fas fa-eye-slash';
            } else {
                apiKeyInput.type = 'password';
                icon.className = 'fas fa-eye';
            }
        }
    }

    // 儲存設定
    saveSettings() {
        const apiKeyInput = document.getElementById('apiKeyInput');
        const enableGPTCheckbox = document.getElementById('enableGPTAnalysis');
        const showChartsCheckbox = document.getElementById('showCharts');
        const showDetailedAnalysisCheckbox = document.getElementById('showDetailedAnalysis');
        
        if (apiKeyInput) {
            const newApiKey = apiKeyInput.value.trim();
            
            // 驗證 API 金鑰格式
            if (newApiKey && !this.validateApiKeyFormat(newApiKey)) {
                this.showMessage('API 金鑰格式不正確，請檢查後重新輸入', 'error');
                return;
            }
            
            this.apiKey = newApiKey;
            
            // 儲存到 localStorage
            if (newApiKey) {
                localStorage.setItem('openai_api_key', newApiKey);
                // 設置GPT服務的API密鑰
                if (typeof gptService !== 'undefined') {
                    gptService.setApiKey(newApiKey);
                }
            } else {
                localStorage.removeItem('openai_api_key');
            }
        }
        
        // 儲存其他設定
        const settings = {
            enableGPTAnalysis: enableGPTCheckbox?.checked ?? false,
            showCharts: showChartsCheckbox?.checked ?? true,
            showDetailedAnalysis: showDetailedAnalysisCheckbox?.checked ?? true
        };
        
        localStorage.setItem('app_settings', JSON.stringify(settings));
        
        this.updateUI();
        this.showMessage('設定已儲存', 'success');
        
        // 延遲關閉模態框
        setTimeout(() => {
            this.closeModal();
        }, 1000);
    }

    // 測試 API 連接
    async testApiConnection() {
        const apiKey = this.apiKey || document.getElementById('apiKeyInput')?.value.trim();
        
        if (!apiKey) {
            this.showMessage('請先輸入 API 金鑰', 'error');
            return;
        }

        const apiStatus = document.getElementById('apiStatus');
        const testBtn = document.getElementById('testApi');
        
        // 更新 UI 狀態
        if (apiStatus) {
            apiStatus.textContent = '測試中...';
            apiStatus.className = 'status-indicator testing';
        }
        if (testBtn) {
            testBtn.disabled = true;
            testBtn.textContent = '測試中...';
        }

        try {
            const response = await fetch('https://api.openai.com/v1/models', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.ok) {
                if (apiStatus) {
                    apiStatus.textContent = '連接成功';
                    apiStatus.className = 'status-indicator valid';
                }
                this.showMessage('API 連接測試成功！', 'success');
            } else {
                throw new Error(`API 錯誤: ${response.status}`);
            }
        } catch (error) {
            console.error('API 測試失敗:', error);
            if (apiStatus) {
                apiStatus.textContent = '連接失敗';
                apiStatus.className = 'status-indicator invalid';
            }
            this.showMessage('API 連接測試失敗，請檢查金鑰是否正確', 'error');
        } finally {
            // 恢復按鈕狀態
            if (testBtn) {
                testBtn.disabled = false;
                testBtn.textContent = '測試連接';
            }
        }
    }

    // 清除設定
    clearSettings() {
        if (confirm('確定要清除所有設定嗎？此操作無法復原。')) {
            try {
                localStorage.removeItem('openai_api_key');
                this.apiKey = null;
                
                const apiKeyInput = document.getElementById('apiKeyInput');
                if (apiKeyInput) {
                    apiKeyInput.value = '';
                }
                
                this.updateUI();
                this.showMessage('設定已清除', 'success');
                
                // 通知其他模組 API 金鑰已清除
                if (window.baziAnalysis) {
                    window.baziAnalysis.updateApiKey(null);
                }
            } catch (error) {
                console.error('清除設定失敗:', error);
                this.showMessage('清除失敗', 'error');
            }
        }
    }

    // 驗證 API 金鑰格式
    validateApiKeyFormat(apiKey) {
        return typeof apiKey === 'string' && apiKey.startsWith('sk-') && apiKey.length > 20;
    }

    // 顯示訊息
    showMessage(message, type = 'info') {
        // 創建訊息元素
        const messageEl = document.createElement('div');
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        
        // 添加樣式
        Object.assign(messageEl.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: 'bold',
            zIndex: '10000',
            maxWidth: '300px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            animation: 'slideInRight 0.3s ease'
        });
        
        // 設定背景顏色
        switch (type) {
            case 'success':
                messageEl.style.backgroundColor = '#28a745';
                break;
            case 'error':
                messageEl.style.backgroundColor = '#dc3545';
                break;
            case 'warning':
                messageEl.style.backgroundColor = '#ffc107';
                messageEl.style.color = '#212529';
                break;
            default:
                messageEl.style.backgroundColor = '#17a2b8';
        }
        
        // 添加到頁面
        document.body.appendChild(messageEl);
        
        // 3秒後自動移除
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.style.animation = 'slideOutRight 0.3s ease';
                setTimeout(() => {
                    if (messageEl.parentNode) {
                        messageEl.parentNode.removeChild(messageEl);
                    }
                }, 300);
            }
        }, 3000);
    }

    // 獲取當前 API 金鑰
    getApiKey() {
        return this.apiKey;
    }

    // 檢查是否已設定 API 金鑰
    hasApiKey() {
        return !!this.apiKey;
    }
}

// 添加動畫樣式
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 全域設定管理器實例
window.settingsManager = null;

// 當 DOM 載入完成時初始化
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.settingsManager = new SettingsManager();
    });
} else {
    window.settingsManager = new SettingsManager();
}