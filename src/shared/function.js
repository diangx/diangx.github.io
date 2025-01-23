import axios from 'axios';

const CRYPTO_SERVERADDRESS = process.env.CRYPTO_SERVERADDRESS
const key = JSON.parse(sessionStorage.getItem("env"));

/*********************************************************************************************/
/******************************************** GET ********************************************/

/* 계좌 정보
    curl "http://localhost:3000/api/account"
*/
export const getAccount = () => {
	return new Promise((resolve) => {
        axios.get(CRYPTO_SERVERADDRESS+'/api/account',
        {
            params : {
                key
            }
        },
        {
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp)=>{
            resolve(resp.data);
        }).catch((err)=>{
            console.log("getAccount\n"+err)
            resolve([]);
        });
	});
};

/* 마켓 상태
@market : KRW, BTC or '' ...
    curl "http://localhost:3000/api/markets"
    curl "http://localhost:3000/api/markets?currency=BTC"
*/
export function getMarketByCurrency (market) {
	return new Promise((resolve) => {
        let currency = market || ''
        axios.get(CRYPTO_SERVERADDRESS+'/api/markets',{
            params: { currency },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp)=>{
            resolve(resp.data);
        }).catch((err)=>{
            console.log("getMarketByCurrency\n"+err)
            resolve([]);
        });
	});
};


/* 마켓 가격 
@markets : "KRW-BTC" "KRW-BTC,KRW-ETH"
    curl "http://localhost:3000/api/ticker?markets=KRW-ETH,KRW-BTC"
*/
export function getMarketTicker (market) {
	return new Promise((resolve) => {
        let markets = market || 'KRW-BTC'
        axios.get(CRYPTO_SERVERADDRESS+'/api/ticker',{
            params: { markets },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp)=>{
            resolve(resp.data);
        }).catch((err)=>{
            console.log("getMarketTicker\n"+err)
            resolve([]);
        });
	});
};

/* 캔들 데이터
@timeframe : seconds, minutes, days, weeks, months, minutes/3, minutes/5
@market : KRW-BTC ...
@count : null, 1 ~ ???
note : minutes can with params 1, 3, 5, 15, 10, 30, 60, 240
    curl "http://localhost:3000/api/candles?timeframe=seconds&market=KRW-BTC&count=1"
    curl "http://localhost:3000/api/candles?timeframe=minutes/3&market=KRW-BTC&count=10"
    curl "http://localhost:3000/api/candles?timeframe=minutes/5&market=KRW-BTC&count=5"
    curl "http://localhost:3000/api/candles?timeframe=days&market=KRW-BTC&count=10"
    curl "http://localhost:3000/api/candles?timeframe=weeks&market=KRW-BTC&count=4"
    curl "http://localhost:3000/api/candles?timeframe=months&market=KRW-BTC&count=12"
*/
export function getCandleDate (req) {
	return new Promise((resolve) => {
        const { timeframe, market, count } = req;

        axios.get(CRYPTO_SERVERADDRESS+'/api/candles',{
            params: { 
                timeframe : timeframe,
                market : market,
                count : count || ''
             },
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((resp)=>{
            resolve(resp.data);
        }).catch((err)=>{
            console.log("getCandleDate\n"+err)
            resolve([]);
        });
	});
};
