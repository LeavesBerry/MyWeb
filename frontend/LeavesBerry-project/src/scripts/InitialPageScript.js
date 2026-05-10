
document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('#navbar').classList.add('home');
    // 获取
    const BgMusic = document.querySelector('#background-music');
    const WelcomeContainer = document.querySelector('#welcome-container');
    const WelcomeElements = document.querySelectorAll('.welcome');
    const WaterImg = document.querySelector('#drop-crystal-img');
    const SproutImg = document.querySelector('#bottom-plumule-img');
    const Gravity = window.innerHeight * 0.0006;
    const SendImg = document.querySelector('#send-img');
    const CenterLeafImg = document.querySelector('#center-leaf-img');
    const LeavesImgs = document.querySelectorAll('.leaves-img');
    const WelcomeTitles = document.querySelectorAll(".welcome-title");
    const HomeElements = document.querySelectorAll('.home');
    ///变量赋值
    document.documentElement.style.viewTransitionName = 'root';
    let Speed = 0;
    let DropY = 0;
    let Initialized = false;

    // transform掉落
    function Drop() {
        Speed += Gravity;
        DropY += Speed;
        WaterImg.style.transform = `translate(-50%, ${DropY}px) rotate(180deg)`;

        const DropRect = WaterImg.getBoundingClientRect();
        const BottomRect = SproutImg.getBoundingClientRect();
        const DropCenterY = DropRect.top + DropRect.height / 2;
        const BottomCenterY = BottomRect.top + BottomRect.height / 2;

        if (Math.abs(DropCenterY - BottomCenterY) < 25) {
            StartLeavesAnim();
            WaterImg.style.display = 'none';
            SproutImg.style.display = 'none';
            Speed = 0;
            DropY = 0;
            return;
        }
        requestAnimationFrame(Drop);
    }

    // 分批启动动画
    function StartLeavesAnim() {
        // 第0帧：种子
        SendImg.style.animationPlayState = 'running';

        // 80ms后：中心叶子
        setTimeout(() => {
            CenterLeafImg.style.animationPlayState = 'running';
        }, 80);

        // 180ms后：四周叶子
        setTimeout(() => {
            LeavesImgs.forEach(img => img.style.animationPlayState = 'running');
        }, 180);

        // 文字淡入
        setTimeout(() => {
            WelcomeTitles.forEach(e => {
                e.style.opacity = '1';
                e.style.visibility = 'visible';
            });
        }, 800);
        setTimeout(() => {
            Initialized = !Initialized;
        }, 1800);
    }

    // 进入home页面
    document.addEventListener('click', function () {
        if (Initialized) {
            Initialized = !Initialized;
            WelcomeElements.forEach(e => {
                e.style.opacity = '0';
                e.style.visibility = 'hidden';
            });
            setTimeout(() => {
                HomeElements.forEach(e => {
                    e.style.opacity = '1';
                    e.style.visibility = 'visible';
                });
            }, 500);
            setTimeout(() => {
                if (WelcomeContainer) WelcomeContainer.remove();
                document.body.style.overflowY = "auto";
                BgMusic.play();
            }, 1500);
        }
    });
    // GPU提前预热，页面加载后自动启动掉落动画
    window.addEventListener('load', Drop);
});