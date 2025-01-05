
const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-E66DC962-A7CD-4F31-BDE0-966A091B881C'

fetch(url)
    .then(response => response.json())
    .then(data => {

        // 創造新的陣列先將北、中、南、東、離島地區分類
        const classifiedData = {
            northernTaiwan: [],
            centralTaiwan: [],
            southernTaiwan: [],
            easternTaiwan: [],
            outlyingIslands: [],
        };

        // 使用迴圈找出縣市名稱並分類 ; 用 includes 來判斷陣列中是否包含該地點名稱，是的話則添加，不是則不添加
        data.records.location.forEach(areaData => {
            const locationName = areaData.locationName;
            if (['宜蘭縣', '基隆市', '臺北市', '新北市', '桃園市', '新竹縣', '新竹市'].includes(locationName)) {
                classifiedData.northernTaiwan.push(areaData);
            } else if (['苗栗縣', '臺中市', '彰化縣', '南投縣', '雲林縣'].includes(locationName)) {
                classifiedData.centralTaiwan.push(areaData);
            } else if (['嘉義縣', '嘉義市', '臺南市', '高雄市', '屏東縣'].includes(locationName)) {
                classifiedData.southernTaiwan.push(areaData);
            } else if (['花蓮縣', '臺東縣'].includes(locationName)) {
                classifiedData.easternTaiwan.push(areaData);
            } else if (['澎湖縣', '金門縣', '連江縣'].includes(locationName)) {
                classifiedData.outlyingIslands.push(areaData);
            }
        });

        // 滑鼠移入移入後渲染畫面
        const paths = document.querySelectorAll('path');
        const myArea = document.querySelector('#my-area');
        paths.forEach(path => {
            path.onmouseover = () => {
                const locationName = path.dataset.name;
                const regionData = getRegionData(locationName);
                const { weatherElement } = regionData;
                const wx = weatherElement[0].time[0].parameter.parameterName;
                const pop = weatherElement[1].time[0].parameter.parameterName;
                const minT = weatherElement[2].time[0].parameter.parameterName;
                const maxT = weatherElement[4].time[0].parameter.parameterName;
                const ci = weatherElement[3].time[0].parameter.parameterName;
                if (regionData) {
                    myArea.innerHTML =
                        `${locationName}
                        <br>${wx}
                        <br>降雨機率：${pop}% ☔
                        <br>最低溫：${minT} 最高溫：${maxT} 🌡️
                        <br>舒適度：${ci}`;
                }
            };
            // 滑鼠移出後清除畫面
            path.onmouseout = () => {
                myArea.innerHTML = '';
            };
        });

        // 根據地區名稱取得分類資料
        function getRegionData(locationName) {
            if (classifiedData.northernTaiwan.some(area => area.locationName === locationName)) {
                return classifiedData.northernTaiwan.find(area => area.locationName === locationName);
            } else if (classifiedData.centralTaiwan.some(area => area.locationName === locationName)) {
                return classifiedData.centralTaiwan.find(area => area.locationName === locationName);
            } else if (classifiedData.southernTaiwan.some(area => area.locationName === locationName)) {
                return classifiedData.southernTaiwan.find(area => area.locationName === locationName);
            } else if (classifiedData.easternTaiwan.some(area => area.locationName === locationName)) {
                return classifiedData.easternTaiwan.find(area => area.locationName === locationName);
            } else if (classifiedData.outlyingIslands.some(area => area.locationName === locationName)) {
                return classifiedData.outlyingIslands.find(area => area.locationName === locationName);
            }
            return null;
        };

        // 隱藏地圖
        const sweetPotato = document.querySelector('#sweetpotato')
        const logoBtn = document.querySelector('.logo')
        const hiddenPotato = () => {
            sweetPotato.classList.remove('show-potato')
            sweetPotato.classList.add('hide-potato')
            cardContainer.innerHTML = '';
        };

        // 點擊logo的時候出現地圖並清空卡片
        logoBtn.addEventListener('click', () => {
            sweetPotato.classList.remove('hide-potato')
            sweetPotato.classList.add('show-potato')
            cardContainer.innerHTML = '';
        });

        // 獲取今天的日期，用於卡片        
        const now = new Date();
        const month = now.getMonth() + 1;
        const date = now.getDate();

        // 卡片內容的函式
        const cardContainer = document.querySelector('.card-container')
        const generateAreaCards = (areaData) => {
            areaData.forEach(area => {
                const weatherElement = area.weatherElement
                const wx = weatherElement[0].time[0].parameter.parameterName;
                const pop = weatherElement[1].time[0].parameter.parameterName;
                const minT = weatherElement[2].time[0].parameter.parameterName;
                const maxT = weatherElement[4].time[0].parameter.parameterName;
                const ci = weatherElement[3].time[0].parameter.parameterName;

                cardContainer.innerHTML +=
                    `<div class="cards">
                        <div class="card">
                            <p class="day">${month}／${date}</p>
                            <div class="weather-img"></div>
                            <h2 class="area-name">${area.locationName}</h2>
                            <br class="weather-info">
                                ${wx}<br>
                                降雨機率：${pop} %</br>
                                最低溫：${minT} ℃<br>
                                最高溫：${maxT} ℃<br>
                                ${ci}
                            </b>
                        </div>
                    </div>`
            });
        };

        // 生成北部卡片
        const northBtn = document.querySelector('.north')
        northBtn.addEventListener('click', () => {
            hiddenPotato()
            generateAreaCards(classifiedData.northernTaiwan)
        });
        // 生成中部卡片
        const middleBtn = document.querySelector('.middle')
        middleBtn.addEventListener('click', () => {
            hiddenPotato()
            generateAreaCards(classifiedData.centralTaiwan)
        });
         // 生成南部卡片
        const southBtn = document.querySelector('.south')
        southBtn.addEventListener('click', () => {
            hiddenPotato()
            generateAreaCards(classifiedData.southernTaiwan)
        });
        
        // 生成東部卡片
        const eastBtn = document.querySelector('.east')
        eastBtn.addEventListener('click', () => {
            hiddenPotato()
            generateAreaCards(classifiedData.easternTaiwan)
        });
         // 生成離島卡片
        const islandBtn = document.querySelector('.island')
        islandBtn.addEventListener('click', () => {
            hiddenPotato()
            generateAreaCards(classifiedData.outlyingIslands)
        });
    });

// 時鐘///////////////////////////////////////////////////////////////////////////////////////////////
const newDate = document.querySelector('.date')
const clock = document.querySelector('.clock')

// 補 0 的函式
const padStartToTow = (time) => {
    return `${time}`.padStart(2, '0')
};

const getDataTime = () => {
    //日期
    const now = new Date();
    const year = now.getFullYear();
    const month = padStartToTow(now.getMonth() + 1);
    const date = padStartToTow(now.getDate());

    // 時間
    const h = padStartToTow(now.getHours())
    const m = padStartToTow(now.getMinutes())
    const s = padStartToTow(now.getSeconds())
    newDate.textContent = `${year}-${month}-${date}`
    clock.textContent = `${h}:${m}:${s}`
}
// 讓畫面不會卡幀
getDataTime()

setInterval(getDataTime, 1000)