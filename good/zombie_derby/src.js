(function(m, e, t, r, i, k, a) {
    m[i] = m[i] || function() {
        (m[i].a = m[i].a || []).push(arguments)
    }
    ;
    m[i].l = 1 * new Date();
    for (var j = 0; j < document.scripts.length; j++) {
        if (document.scripts[j].src === r) {
            return;
        }
    }
    k = e.createElement(t),
    a = e.getElementsByTagName(t)[0],
    k.async = 1,
    k.src = r,
    a.parentNode.insertBefore(k, a)
}
)(window, document, "script", "https://cdn.jsdelivr.net/npm/yandex-metrica-watch/tag.js", "ym");

ym(93577277, "init", {
    clickmap: true,
    trackLinks: true,
    accurateTrackBounce: true
});

function getMultipleRandom(arr, num) {
    const shuffled = [...arr].sort(()=>0.5 - Math.random());
    return shuffled.slice(0, num);
}

let viewTime = 15000;
let coutGames = 6;
let url = window.location !== window.parent.location ? null != location.ancestorOrigins ? location.ancestorOrigins[0] : document.referrer : document.location.href;
let ref = url.match(/\/\/([^\/]+)/);
let isFramed = false;

let css = '#bbbox{background:#fff;border-radius:5px;display:table;position:fixed;margin-left:auto;margin-right:auto;left:0;right:0;bottom:-120px;text-align:center;z-index: 9999999;}     #bbbox img{margin:5px;border-radius:20px;width:80px;height:80px;box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;cursor:pointer;}    #bbbox img:hover{width:78px;height:78px;transition: 0.2s;}    .activebox{bottom:10px!important;transition:bottom 1s;}   .nactivebox{bottom:-120px!important;transition:bottom 1s;}    #bbbox span{position:absolute;top:-10px;right:-10px;cursor:pointer;background:#ccc;border-radius:100%;color:#000;padding: 0px 5px 2px 5px;font-size: 20px;font-weight: bold;line-height: 20px;}#bbbox span:hover{color:#fff;background:red}'
  , head = document.head || document.getElementsByTagName('head')[0]
  , style = document.createElement('style');
head.appendChild(style);
style.type = 'text/css';
if (style.styleSheet) {
    style.styleSheet.cssText = css;
} else {
    style.appendChild(document.createTextNode(css));
}

function go() {
    let gems = [{
        "image": "/uploads/posts/2023-11/thumbs/HillsofSteel_1700425650655a6fb2525ed7.45043483.jpg",
        "url": "/dlya-malchikov/tanki/49967-stalnye-holmy.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/RedBall4_170532961165a543cb33cbb1.90513099.jpg",
        "url": "/igry-krasnyy-shar/50422-krasnyy-shar-4.html"
    }, {
        "image": "/uploads/posts/2023-10/thumbs/NoobvsFNAF_16987017226540219a8518b6.93072594.jpg",
        "url": "/strelyalki-na-dvoih/49652-nubik-vs-fnaf-dlya-dvoih.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SubwaySurfersWorldTourHauntedHood_1701676967656d87a798f239.75400478.jpg",
        "url": "/igry-subway-surfers/49968-sabvey-serf-prizrachnyy-kapyushon.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/TanksArenaioCraftCombat_1699709128654f80c81f75a1.15457628.jpg",
        "url": "/dlya-malchikov/tanki/49873-tanks-arena-io-remeslo-i-boy.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/SubwaySurfersWorldTourSeoul2023_1700421260655a5e8c939172.21143743.jpg",
        "url": "/igry-subway-surfers/49957-sabvey-serf-seul-2023.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/CatSimulatorOnline_1699479307654bff0b8beea9.69297596.jpg",
        "url": "/dlya-devochek/koshki/49829-simulyator-koshki.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SkibidiToiletClicker_1701476897656a7a21268089.59841823.jpg",
        "url": "/igry-skibidi/50077-tualetnyy-kliker-skibidi.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/MountainTank_1702888941658005ed4c7f14.32818584.jpg",
        "url": "/dlya-malchikov/tanki/50129-gornyy-tank.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/SubwaySurfersWorldTourLondon2023_170556600665a8df367c3fe5.53545893.jpg",
        "url": "/igry-subway-surfers/50330-sabvey-serf-london-2023.html"
    }, {
        "image": "/uploads/posts/2024-02/thumbs/SubwaySurfersWorldTourShenzhenShowdown_170790261565cc86979fadd1.27961780.jpg",
        "url": "/igry-subway-surfers/50565-sabvey-serf-shenchzhenskie-razborki.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/TankCraft_170600646065af97bca64c28.76269952.jpg",
        "url": "/dlya-malchikov/tanki/50523-tankcraft-tank-bitva.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/HumansPlaygroun_17010966606564acd43f5226.02832409.jpg",
        "url": "/igry-pleygraund/50030-chelovecheskaya-pesochca.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/ShadyBears_1700423083655a65abb50553.32169250.jpg",
        "url": "/igry-na-dvoih/49961-medvedi-i-teni.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/BeadsColourPainting3D_17011075536564d761582d69.70361298.jpg",
        "url": "/igry-raskraski-po-kletochkam/50031-cvetnaya-rospis-biserom-3d.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/MadnessFueledByHotdogs_170660744465b8c354ae12e1.24145804.jpg",
        "url": "/igry-bezumie/50440-madness-zapravlennyy-hot-dogami.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/CrazyBalls3D_170016305065566dea2fbea6.56977570.jpg",
        "url": "/mini-igry/49934-sumasshedshie-shariki-3d.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/AnimalArena_1704462553659808d9368798.06190880.jpg",
        "url": "/igry-na-troih/50328-bitva-zhivotnyh.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/MadMedicine_17034292346588447231c4e4.88342435.jpg",
        "url": "/igry-rannery/50214-bezumnaya-medicina.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/MuscleClicker_170118667965660c771f2d56.31455027.jpg",
        "url": "/igry-klikery/50054-muskulnyy-kliker.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/PaintballKing_170515781465a2a4b6ec9435.67073099.jpg",
        "url": "/igry-strelyalki/50393-korol-peyntbola.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/RealDriftMultiplayer2_1702037813657309356d4317.93368655.jpg",
        "url": "/igry-po-seti/50152-realnyy-drift-multipleer-2.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/AirportSecurity_170626026765b3772b7ca382.34035851.jpg",
        "url": "/igry-policiya/50381-sluzhba-bezopasnosti-v-aeroportu.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/SniperCombat_1700555143655c6987dca169.46489474.jpg",
        "url": "/igry-snayper/49980-snayperskiy-boy.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/PoliceCarRealCopSimulator_17032629866585bb0a67a908.28410334.jpg",
        "url": "/igry-policiya/50197-nastoyaschiy-simulyator-policeyskogo.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/NoobFuse_1700562158655c84eebeea78.03250639.jpeg",
        "url": "/igry-maynkraft/49983-nub-vzryvatel.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/BeaverBuilder_170514181965a2663b705b14.04819849.jpg",
        "url": "/dlya-devochek/zhivotnye/50379-bober-stroitel.html"
    }, {
        "image": "/uploads/posts/2024-02/thumbs/SubwaySurfersWorldTourLoveOdyssey_170842032365d46ce396fad9.02893548.jpg",
        "url": "/igry-subway-surfers/50614-sabvey-serf-lyubovnaya-odisseya.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/HealingRush_1701767461656ee9252f2302.39323813.jpg",
        "url": "/dlya-devochek/bolnica/49841-iscelyayuschiy-poryv.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/MiniDuelsBattle_17018924186570d1423e13f3.80102447.jpg",
        "url": "/igry-na-dvoih/50124-mini-duelnye-bitvy.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SnakeofBulletsCollectandShoot_170315307065840daef0f023.22640844.jpg",
        "url": "/igry-oruzhie/50187-sobiray-zmeyku-iz-pul-i-strelyay.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/TheBestRussianBilliards_170410676765929b0f186492.15576297.jpg",
        "url": "/igry-bilyard/50272-luchshiy-russkiy-bilyard.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/DeadAimSkibidiToiletsAttack_1700550544655c579096d8b2.95085888.jpg",
        "url": "/igry-skibidi/49977-ataka-tualetov-skibidi-s-mertvoy-celyu.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/CozyRoomDesign_17043098366595b44cccc5e1.52033328.jpg",
        "url": "/dlya-devochek/komnaty/50315-uyutnyy-dizayn-komnaty.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SkibidiStrike_170185179565703293da6616.54763895.jpg",
        "url": "/igry-skibidi/50120-skibidi-strayk.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SkibidiToiletPuzzle_1701459510656a3636a01287.92637438.jpg",
        "url": "/igry-skibidi/50065-tualetnaya-golovolomka-skibidi.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/NoobZombiePrisonEscape_1704482507659856cb5eff33.68978155.jpg",
        "url": "/igry-maynkraft/50334-nub-pobeg-iz-tyurmy-zombi.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/E30DriftSimulator_1700554685655c67bd9e8317.87847394.jpg",
        "url": "/igry-drift/49979-simulyator-drifta-e30.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/VEX3Xmas_17010313396563adab9fc281.28108332.jpg",
        "url": "/igry-novyy-god/50016-veks-3-rozhdestvo.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/IdleBusinessTycoon3D_170205101765733cc960b245.53660028.jpg",
        "url": "/igry-biznes/50155-idl-biznes-magnat-3d.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/GrandCyberCity_170539421465a64026c739f0.60964586.jpg",
        "url": "/gonki-na-dvoih/50434-grandioznyy-kiber-gorod.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/ObstacleRaceDestroyingSimulator_1704797842659d2692ee3d92.33109329.jpg",
        "url": "/dlya-malchikov/gonki/50365-gonka-s-prepyatstviyami-razrushayuschiy-simulyator.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/CraftDrill_170599018165af582585ebe5.31547202.jpg",
        "url": "/dlya-malchikov/50512-remeslennaya-drel.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/LiftingHero_17034288806588431090b483.14644891.jpg",
        "url": "/igry-klikery/50213-podnimayuschiy-geroy.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/RacingCarDrivingCarGames_1701456480656a2a603757d0.90735999.jpeg",
        "url": "/dlya-malchikov/gonki/50064-vozhdenie-gonochnogo-avtomobilya.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/AngryPlant_17041902736593e141c5d591.30708250.jpg",
        "url": "/igry-rasteniya-protiv-zombi/50292-serditye-rasteniya.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/WarMaster_17030691266582c5c6996697.50457846.jpg",
        "url": "/igry-voyna/50183-master-voyny.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/DrawWeapon3D_17011651376565b8518041a7.21029025.jpg",
        "url": "/igry-oruzhie/49744-narisuyte-oruzhie-3d.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/BlumgiDragon_17030671556582be13bc63f1.93122974.jpg",
        "url": "/igry-na-dvoih/50181-blumdzhi-drakon.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/Vex8_1700423756655a684cad9180.18079743.jpg",
        "url": "/igry-veks/49963-veks-8.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/MyPetsShop_1703565472658a58a0eb6253.89595652.jpg",
        "url": "/igry-magazin/50232-moy-magazin-domashnih-zhivotnyh.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/Dynamons6_1701477207656a7b57b5f244.65064937.jpg",
        "url": "/igry-pokemony/50078-dinamony-6.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/DOP4DrawOnePart_170602092065afd038eb6ce8.83115174.jpg",
        "url": "/igry-golovolomki/50526-shag-4-narisuyte-odnu-chast-ne-rabotaet.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/TPSGunWarShootingGames3D_17010827146564765abe9a65.12575166.jpg",
        "url": "/igry-shutery/50020-tps-gan-var-shuting-3d.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/ZooCraft_1701815153656fa371911ad2.01608996.jpeg",
        "url": "/igry-maynkraft/50112-zookraft.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/StickmanDragonFight_17043283826595fcbe3f0946.84879012.jpg",
        "url": "/igry-stikmen/50325-stikmen-bitva-drakonov.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/AmongvsGartenofBanban_170007256765550c77e957d1.30632950.jpg",
        "url": "/igry-among-as/49921-among-protiv-banban.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/NoobMineFactory_1700415062655a4656d5d2f1.02969763.jpg",
        "url": "/igry-nubik/49952-shahtnyy-zavod-nuba.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SlushyMaker_1702393303657875d7a08312.44195613.jpg",
        "url": "/dlya-devochek/gotovim-edu/50168-sozday-slash.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/FishStabGettingBig_170428384265954ec26f4461.84121114.jpg",
        "url": "/igry-na-dvoih/50304-rybnyy-nozh-stanovitsya-bolshe.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/YesorNoChallenge_170540439465a667ea48c643.81771966.jpg",
        "url": "/igry-viktoriny/50436-da-ili-net-chellendzh.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SkibidivsRainbowFriends_1703155948658418ec7c4234.47988288.jpg",
        "url": "/raduzhnye-druzya/50191-skibidi-protiv-raduzhnyh-druzey.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/BalloonClash_16992025526547c5f8c3dff2.87234721.jpg",
        "url": "/igry_draki/49796-stolknovenie-vozdushnyh-sharov.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/HandEvolutionRunner_170315263965840bff1bba88.65464284.jpg",
        "url": "/dlya-devochek/50186-ruchnoy-evolyucionnyy-begun.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/PixelCraft-HideandSeek_1703790237658dc69d757806.01051447.jpg",
        "url": "/igry-pryatki/50247-pikselnoe-remeslo---pryatki.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/RiotAssassin_1704706292659bc0f4ec2498.48056051.jpg",
        "url": "/igry-ekshen/50341-ubiyca-buntovschikov.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/Catpad_17043270196595f76b3f4c03.29767689.jpg",
        "url": "/dlya-devochek/koshki/50321-ketpad.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/MadnessCombat-TheSheriffClones_1699720288654fac603a7165.57918778.jpg",
        "url": "/igry-bezumie/49881-bitva-bezumiya---klony-sherifa.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/SkibidiDefender_1702630238657c135ee64f31.42267395.jpg",
        "url": "/igry-skibidi/50131-skibidi-zaschitnik.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/OffroadLife3D_170538371065a6171e637428.82083252.jpg",
        "url": "/igry-dzhipy/50426-vnedorozhnaya-zhizn-3d.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/StickmanBrokenBonesio_1703792046658dcdae70b6f2.97352422.jpeg",
        "url": "/igry-stikmen/50250-stikmen-slomannye-kosti-io.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/SonicSuperstars_1699812863655115ffb983e3.18197780.jpg",
        "url": "/sonik/49897-sonik-superstar.html"
    }, {
        "image": "/uploads/posts/2024-02/thumbs/TheLittleGiant2_170800038965ce048529a748.88738514.jpg",
        "url": "/igry-begalki/23390-malenkiy-gigant.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/IceCreamCafe_1704730296659c1eb82c0e54.12777971.jpg",
        "url": "/dlya-devochek/kafe/50352-kafe-morozhenoe.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/CSOnline_170600158965af84b513a950.00551485.jpg",
        "url": "/igry-kontr-strayk/49915-cs-onlayn.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/ToiletMonsterEvolution_170102685765639c29031947.23514647.jpg",
        "url": "/igry-skibidi/50011-evolyuciya-tualetnogo-monstra.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/LevelDevil_17030687026582c41e70d032.67675648.jpg",
        "url": "/igry-platformery/50182-uroven-dyavola.html"
    }, {
        "image": "/uploads/posts/2024-01/thumbs/SportcarsCrash_170556840565a8e895cc4ed2.32359841.jpg",
        "url": "/igry-razbivat-mashiny/50339-avarii-sportivnyh-avtomobiley.html"
    }, {
        "image": "/uploads/posts/2023-11/thumbs/RealHighStuntCarExtreme_17011664626565bd7ec91d77.34446689.jpg",
        "url": "/igry-tryuki-na-mashinah/50043-nastoyaschie-vysokie-ekstremalnye-avtomobilnye-tryuki.html"
    }, {
        "image": "/uploads/posts/2023-12/thumbs/HamsterStackMaze_1703579545658a8f9964e732.53519237.jpg",
        "url": "/dlya-devochek/zhivotnye/49990-labirint-dlya-homyachkov.html"
    }];

    let randomGames = getMultipleRandom(gems, coutGames);
    const box = document.createElement("div");
    box.id = "bbbox";
    document.body.appendChild(box);

    let iconClose = document.createElement('span');
    iconClose.id = "iconClose";
    iconClose.innerHTML = '&times;';
    box.appendChild(iconClose);
    iconClose.onclick = function() {
        document.querySelector('#bbbox').classList.add('nactivebox');
    }

    for (let i = 0; i < coutGames; i++) {
        const img = document.createElement("img");
        img.src = "https://igroutka.ru" + randomGames[i].image;
        const el = document.querySelector("#bbbox");
        el.appendChild(img);
        img.addEventListener('click', function() {
            //window.open("https://igroutka.ru" + randomGames[i].url + "?utm_source=" + ref + "&utm_campaign=ssrc");
			window.open("https://igroutka.ru/?utm_source=" + ref + "&utm_campaign=ssrc");
        });

    }

}

function view() {
    document.querySelector('#bbbox').classList.add('activebox');
}

try {
    isFramed = window != window.top || document != top.document || self.location != top.location;
} catch (e) {
    isFramed = true;
}

if (isFramed) {
    if (ref != null) {
        if (ref[1] == 'igroutka.ru') {} else {
            setTimeout(go, viewTime);
            setTimeout(view, viewTime + 1000);
        }
    }

}