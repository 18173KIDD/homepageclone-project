// ヘッダーメニュー機能
function setupHeaderMenu() {
    const hamburgerButton = document.querySelector('.p-header__hamburger_menu_button');
    const overlay = document.querySelector('.l-header__overlay');
    const body = document.body;

    if (hamburgerButton) {
        hamburgerButton.addEventListener('click', function() {
            body.classList.toggle('is-header_menu_open');
        });
    }

    if (overlay) {
        overlay.addEventListener('click', function() {
            body.classList.remove('is-header_menu_open');
        });
    }
}

// フォームバリデーション
function setupFormValidation() {
    const form = document.querySelector('.diagnosis__form'); // クラス名修正
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        // 必須フィールドのチェック
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                isValid = false;
                showError(field, '必須項目です');
            } else {
                removeError(field);
            }
        });

        // 電話番号のバリデーション
        const phoneField = form.querySelector('#phone');
        if (phoneField && phoneField.value.trim()) {
            // ハイフン有無両方に対応
            const phoneValue = phoneField.value.trim().replace(/-/g, ''); // ハイフンを除去
            const phonePattern = /^0[0-9]{9,10}$/;
            if (!phonePattern.test(phoneValue)) {
                isValid = false;
                showError(phoneField, '正しい電話番号を入力してください（例: 090-1234-5678）');
            } else {
                 removeError(phoneField); // 正しい場合はエラー解除
            }
        }

        // メールアドレスのバリデーション（任意項目）
        const emailField = form.querySelector('#email');
        if (emailField && emailField.value.trim()) {
            // より詳細な正規表現パターン（RFC 5322に近い）
            const emailPattern = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
            if (!emailPattern.test(emailField.value.trim())) {
                isValid = false;
                showError(emailField, '正しいメールアドレスを入力してください（例: example@example.com）');
            } else {
                 removeError(emailField); // 正しい場合はエラー解除
            }
        }

        // フォーム送信
        if (isValid) {
            // 実際の送信処理はここに実装
            // この例ではアラートを表示するだけ
            alert('相場診断フォームが送信されました。実際のサイトでは診断結果が表示されます。');
            form.reset();
            // 全フィールドのエラー解除
            form.querySelectorAll('.error-message').forEach(el => el.remove());
            form.querySelectorAll('input, select').forEach(el => el.style.borderColor = '');
        }
    });

    // エラーメッセージの表示
    function showError(field, message) {
        // 既存のエラーメッセージを削除
        removeError(field);

        // エラーメッセージの作成
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = message;
        errorDiv.style.color = 'red';
        errorDiv.style.fontSize = '12px';
        errorDiv.style.marginTop = '5px';
        errorDiv.style.textAlign = 'left'; // 左寄せ追加

        // フィールドの後にエラーメッセージを挿入
        field.parentNode.appendChild(errorDiv);

        // フィールドにエラースタイルを適用
        field.style.borderColor = 'red';
    }

    // エラーメッセージの削除
    function removeError(field) {
        const parent = field.parentNode;
        const errorMessage = parent.querySelector('.error-message');
        if (errorMessage) {
            errorMessage.remove();
        }
        field.style.borderColor = ''; // 枠線の色を元に戻す
    }

    // 入力時にエラーを消す
    form.querySelectorAll('input, select').forEach(field => {
        field.addEventListener('input', () => removeError(field));
        field.addEventListener('change', () => removeError(field));
    });
}

// アコーディオン機能 (FAQ)
function setupAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length === 0) return;

    faqItems.forEach(item => {
        const questionButton = item.querySelector('.top-page__faq-question');
        const answer = item.querySelector('.top-page__faq-answer');

        if (questionButton && answer) {
            // 初期状態を設定 (CSSで制御する方が望ましい)
            answer.style.maxHeight = '0';
            answer.style.overflow = 'hidden';
            answer.style.transition = 'max-height 0.4s ease-in-out, padding 0.3s ease-out'; // アニメーション改善
            answer.style.paddingTop = '0';
            answer.style.paddingBottom = '0';
            answer.style.opacity = '0';
            answer.style.transition += ', opacity 0.3s ease-out'; // フェードイン効果も追加


            questionButton.addEventListener('click', function() {
                const isActive = item.classList.contains('active');

                // 他のアイテムを閉じる
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const otherAnswer = otherItem.querySelector('.top-page__faq-answer');
                        otherAnswer.style.maxHeight = '0';
                        otherAnswer.style.paddingTop = '0';
                        otherAnswer.style.paddingBottom = '0';
                    }
                });

                // クリックされたアイテムの開閉
                if (!isActive) {
                    item.classList.add('active');
                    answer.style.display = 'block'; // display: block に戻す
                    // 高さを計算してmaxHeightを設定
                    answer.style.paddingTop = '5rem'; // 元のpadding値 (CSSで定義推奨)
                    answer.style.paddingBottom = '5rem'; // 元のpadding値 (CSSで定義推奨)
                    answer.style.opacity = '1'; // フェードイン
                    
                    // 少し遅延させてmaxHeightを設定することでアニメーションが滑らかになる
                    setTimeout(() => {
                        answer.style.maxHeight = answer.scrollHeight + "px";
                    }, 10);
                } else {
                    item.classList.remove('active');
                    answer.style.opacity = '0'; // フェードアウト
                    answer.style.maxHeight = '0';
                    answer.style.paddingTop = '0';
                    answer.style.paddingBottom = '0';
                }
            });
        }
    });
}


// スライダー機能
function setupSlider() {
    // カラーセレクター用のスライダー
    setupColorSelector();
}

// カラーセレクター
function setupColorSelector() {
    const colorPreview = document.querySelector('.mv-house__color-preview');
    const colorButtons = document.querySelectorAll('.mv-house__cycling-button');

    if (!colorPreview || colorButtons.length === 0) return;

    colorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const selectedColor = this.dataset.color;

            // プレビューのクラスを更新
            // 既存の色クラスをすべて削除
            colorPreview.classList.remove('preview--light-blue', 'preview--blue', 'preview--green', 'preview--yellow', 'preview--orange');
            // 新しい色クラスを追加
            colorPreview.classList.add(`preview--${selectedColor}`);

            // アクティブボタンのスタイルを更新
            colorButtons.forEach(btn => btn.classList.remove('button-active'));
            this.classList.add('button-active');
        });
    });
}

// コラムスライダー機能は対象外

// スムーススクロール
function setupSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // ヘッダーの高さを考慮してスクロール位置を調整
                const headerHeight = document.querySelector('.l-header')?.offsetHeight || 0;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// エリア検索 SP用アコーディオン機能
function setupAreaAccordion() {
    const areaListSp = document.querySelector('.top-page__prefectures-map__area-list-sp');
    if (!areaListSp || window.innerWidth >= 768) return; // SP表示のみ

    // 本来はサーバーから地域データを取得するか、HTMLに埋め込む
    const regions = [
        { name: '北海道・東北', prefs: ['北海道', '青森県', '岩手県', '宮城県', '秋田県', '山形県', '福島県'] },
        { name: '関東', prefs: ['東京都', '神奈川県', '千葉県', '埼玉県', '茨城県', '栃木県', '群馬県'] },
        { name: '甲信越・北陸', prefs: ['山梨県', '長野県', '石川県', '新潟県', '富山県', '福井県'] },
        { name: '東海', prefs: ['愛知県', '静岡県', '岐阜県', '三重県'] },
        { name: '関西', prefs: ['大阪府', '兵庫県', '京都府', '滋賀県', '奈良県', '和歌山県'] },
        { name: '中国', prefs: ['岡山県', '広島県', '島根県', '鳥取県', '山口県'] },
        { name: '四国', prefs: ['愛媛県', '香川県', '高知県', '徳島県'] },
        { name: '九州・沖縄', prefs: ['福岡県', '佐賀県', '長崎県', '熊本県', '大分県', '宮崎県', '鹿児島県', '沖縄県'] }
    ];
     // 都道府県コードのマッピング (仮) - 本来はデータとして持つべき
    const prefCodeMap = {
        '北海道': 1, '青森県': 2, '岩手県': 3, '宮城県': 4, '秋田県': 5, '山形県': 6, '福島県': 7,
        '茨城県': 8, '栃木県': 9, '群馬県': 10, '埼玉県': 11, '千葉県': 12, '東京都': 13, '神奈川県': 14,
        '新潟県': 15, '富山県': 16, '石川県': 17, '福井県': 18, '山梨県': 19, '長野県': 20,
        '岐阜県': 21, '静岡県': 22, '愛知県': 23, '三重県': 24,
        '滋賀県': 25, '京都府': 26, '大阪府': 27, '兵庫県': 28, '奈良県': 29, '和歌山県': 30,
        '鳥取県': 31, '島根県': 32, '岡山県': 33, '広島県': 34, '山口県': 35,
        '徳島県': 36, '香川県': 37, '愛媛県': 38, '高知県': 39,
        '福岡県': 40, '佐賀県': 41, '長崎県': 42, '熊本県': 43, '大分県': 44, '宮崎県': 45, '鹿児島県': 46, '沖縄県': 47
    };


    areaListSp.innerHTML = ''; // 中身をクリア

    regions.forEach(region => {
        const regionContainer = document.createElement('div');
        regionContainer.className = 'region-container';

        const regionTitle = document.createElement('h3');
        regionTitle.className = 'region-title';
        regionTitle.textContent = region.name;

        const prefecturesList = document.createElement('ul');
        prefecturesList.className = 'prefectures-list';
        prefecturesList.style.display = 'none'; // 初期状態は非表示
        prefecturesList.style.maxHeight = '0';
        prefecturesList.style.overflow = 'hidden';
        prefecturesList.style.transition = 'max-height 0.4s ease-in-out, padding 0.3s ease-out';
        prefecturesList.style.paddingTop = '0';
        prefecturesList.style.paddingBottom = '0';
        prefecturesList.style.opacity = '0';
        prefecturesList.style.transition += ', opacity 0.3s ease-out';


        region.prefs.forEach(pref => {
            const prefItem = document.createElement('li');
            const prefLink = document.createElement('a');
            const prefCode = prefCodeMap[pref] || '#'; // マップからコード取得
            prefLink.href = `/clients/prefectures/${prefCode}`;
            prefLink.textContent = pref;
            prefItem.appendChild(prefLink);
            prefecturesList.appendChild(prefItem);
        });

        regionContainer.appendChild(regionTitle);
        regionContainer.appendChild(prefecturesList);
        areaListSp.appendChild(regionContainer);

        // アコーディオンのクリックイベント
        regionTitle.addEventListener('click', function() {
            const isOpen = regionContainer.classList.contains('--open');

            if (!isOpen) {
                regionContainer.classList.add('--open');
                prefecturesList.style.display = 'grid'; // grid表示に戻す
                prefecturesList.style.paddingTop = '1.6rem'; // 元のpadding
                prefecturesList.style.paddingBottom = '1.6rem'; // 元のpadding
                prefecturesList.style.opacity = '1'; // フェードイン
                
                // 少し遅延させて滑らかなアニメーションを実現
                setTimeout(() => {
                    prefecturesList.style.maxHeight = prefecturesList.scrollHeight + "px";
                }, 10);
            } else {
                regionContainer.classList.remove('--open');
                prefecturesList.style.opacity = '0'; // フェードアウト
                prefecturesList.style.maxHeight = '0';
                prefecturesList.style.paddingTop = '0';
                prefecturesList.style.paddingBottom = '0';
                
                // 完全に閉じた後に表示をnoneに戻す（アニメーション終了後）
                setTimeout(() => {
                    if (!regionContainer.classList.contains('--open')) {
                        prefecturesList.style.display = 'none';
                    }
                }, 400); // アニメーション完了時間と同期
            }
        });
    });
}

// 地図ホバー効果の実装
function setupMapHover() {
    if (window.innerWidth < 768) return; // PC表示のみ実装

    // SVG地図の各パス要素を取得
    const mapSvg = document.querySelector('.map-svg');
    if (!mapSvg) return;

    // 都道府県コードとパスIDのマッピング
    const prefPathMap = {
        1: 'hokkaido', 2: 'aomori', 3: 'iwate', 4: 'miyagi', 5: 'akita',
        6: 'yamagata', 7: 'fukushima', 8: 'ibaraki', 9: 'tochigi', 10: 'gunma',
        11: 'saitama', 12: 'chiba', 13: 'tokyo', 14: 'kanagawa', 15: 'niigata',
        16: 'toyama', 17: 'ishikawa', 18: 'fukui', 19: 'yamanashi', 20: 'nagano',
        21: 'gifu', 22: 'shizuoka', 23: 'aichi', 24: 'mie', 25: 'shiga',
        26: 'kyoto', 27: 'osaka', 28: 'hyogo', 29: 'nara', 30: 'wakayama',
        31: 'tottori', 32: 'shimane', 33: 'okayama', 34: 'hiroshima', 35: 'yamaguchi',
        36: 'tokushima', 37: 'kagawa', 38: 'ehime', 39: 'kochi', 40: 'fukuoka',
        41: 'saga', 42: 'nagasaki', 43: 'kumamoto', 44: 'oita', 45: 'miyazaki',
        46: 'kagoshima', 47: 'okinawa'
    };

    // SVG内の都道府県パスにイベントを設定
    const prefPaths = mapSvg.querySelectorAll('path');
    prefPaths.forEach(path => {
        // データ属性から都道府県コードを取得（存在しない場合は処理しない）
        const prefId = path.getAttribute('data-pref-id');
        if (!prefId) return;

        // ホバー効果
        path.addEventListener('mouseenter', function() {
            // パスの色を変更
            this.classList.add('prefecture-hover');
            
            // 対応する都道府県リンクもハイライト
            const prefLink = document.querySelector(`.list-pref a[href="/clients/prefectures/${prefId}"]`);
            if (prefLink) {
                prefLink.classList.add('prefecture-link-hover');
                // リンクが見えるようにスクロール（視認性向上のため）
                // prefLink.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });

        path.addEventListener('mouseleave', function() {
            // パスの色を元に戻す
            this.classList.remove('prefecture-hover');
            
            // 対応する都道府県リンクのハイライトも解除
            const prefLink = document.querySelector(`.list-pref a[href="/clients/prefectures/${prefId}"]`);
            if (prefLink) {
                prefLink.classList.remove('prefecture-link-hover');
            }
        });

        // クリック時の動作
        path.addEventListener('click', function() {
            window.location.href = `/clients/prefectures/${prefId}`;
        });

        // カーソルをポインターに
        path.style.cursor = 'pointer';
    });

    // 逆方向のホバー効果（リンクにホバーしたとき地図も強調）
    const prefLinks = document.querySelectorAll('.list-pref a');
    prefLinks.forEach(link => {
        const href = link.getAttribute('href');
        const prefIdMatch = href.match(/\/clients\/prefectures\/(\d+)/);
        
        if (prefIdMatch && prefIdMatch[1]) {
            const prefId = parseInt(prefIdMatch[1]);
            const pathId = prefPathMap[prefId];
            
            link.addEventListener('mouseenter', function() {
                // リンクをハイライト
                this.classList.add('prefecture-link-hover');
                
                // 対応するSVGパスも強調
                const path = document.querySelector(`.map-svg path[data-pref-id="${prefId}"]`);
                if (path) {
                    path.classList.add('prefecture-hover');
                }
            });

            link.addEventListener('mouseleave', function() {
                // リンクのハイライトを解除
                this.classList.remove('prefecture-link-hover');
                
                // 対応するSVGパスの強調も解除
                const path = document.querySelector(`.map-svg path[data-pref-id="${prefId}"]`);
                if (path) {
                    path.classList.remove('prefecture-hover');
                }
            });
        }
    });
}

// SVGパスに都道府県IDをデータ属性として追加
function setupSvgMap() {
    const mapSvg = document.querySelector('.map-svg');
    if (!mapSvg) return;

    // 都道府県IDとパスIDのマッピング（本来はこのデータは既に存在している、またはHTMLに埋め込まれているべき）
    const pathPrefMap = {
        'hokkaido': 1, 'aomori': 2, 'iwate': 3, 'miyagi': 4, 'akita': 5,
        'yamagata': 6, 'fukushima': 7, 'ibaraki': 8, 'tochigi': 9, 'gunma': 10,
        'saitama': 11, 'chiba': 12, 'tokyo': 13, 'kanagawa': 14, 'niigata': 15,
        'toyama': 16, 'ishikawa': 17, 'fukui': 18, 'yamanashi': 19, 'nagano': 20,
        'gifu': 21, 'shizuoka': 22, 'aichi': 23, 'mie': 24, 'shiga': 25,
        'kyoto': 26, 'osaka': 27, 'hyogo': 28, 'nara': 29, 'wakayama': 30,
        'tottori': 31, 'shimane': 32, 'okayama': 33, 'hiroshima': 34, 'yamaguchi': 35,
        'tokushima': 36, 'kagawa': 37, 'ehime': 38, 'kochi': 39, 'fukuoka': 40,
        'saga': 41, 'nagasaki': 42, 'kumamoto': 43, 'oita': 44, 'miyazaki': 45,
        'kagoshima': 46, 'okinawa': 47
    };

    // SVGのパス要素にIDを追加
    const paths = mapSvg.querySelectorAll('path');
    paths.forEach(path => {
        const id = path.getAttribute('id');
        if (id && pathPrefMap[id]) {
            path.setAttribute('data-pref-id', pathPrefMap[id]);
        }
    });
}

// 初期化関数
function initializeAll() {
    setupHeaderMenu();
    setupFormValidation();
    setupAccordion();
    setupSlider();
    setupSmoothScroll();
    setupAreaAccordion();
    setupSvgMap(); // SVG地図の準備
    setupMapHover(); // 地図ホバー効果の追加
}

// DOMContentLoadedイベントで全機能を初期化
document.addEventListener('DOMContentLoaded', initializeAll);

// ウィンドウリサイズ時の再評価
window.addEventListener('resize', function() {
    setupAreaAccordion();
    setupMapHover();
});