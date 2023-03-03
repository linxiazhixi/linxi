[Script]
TF信息获取 = type=http-request,pattern=^https:\/\/testflight\.apple\.com\/v3\/accounts/.*\/apps$,requires-body=0,script-path=https://raw.githubusercontent.com/linxiazhixi/surge/main/TFhqxx.js
[MITM]
hostname = %APPEND% testflight.apple.com

const reg1 = /^https://testflight.apple.com/join//i;
const reg2 = /^https://testflight.apple.com/dashboard/apps/d+/testers/d+/i;

if (reg1.test($request.url)) {
  $persistentStore.write(null, 'request_id');
  let url = $request.url;
  let key = url.replace(/(.*accounts/)(.*)(/apps)/, '$2');

  let session_id = $request.headers['x-session-id'];
  let session_digest = $request.headers['x-session-digest'];
  let request_id = $request.headers['x-request-id'];
  $persistentStore.write(key, 'key');
  $persistentStore.write(session_id, 'session_id');
  $persistentStore.write(session_digest, 'session_digest');
  $persistentStore.write(request_id, 'request_id');
  if ($persistentStore.read('request_id') !== null) {
    $notification.post('TestFlight自动加入', '信息获取成功", '');
  } else {
    $notification.post('TestFlight自动加入', '信息获取失败', '请添加testflight.apple.com');
  }
  $done({});
} else if (reg2.test($request.url)) {
  let appId = $persistentStore.read('APP_ID');
  if (!appId) {
    appId = '';
  }
  let arr = appId.split(',');
  const id = reg2.exec($request.url)[1];
  arr.push(id);
  arr = unique(arr).filter((a) => a);
  if (arr.length > 0) {
    appId = arr.join(',");
  }
  $persistentStore.write(appId, 'APP_ID');
  $notification.post('TestFlight自动加入', 已添加APP_ID: ${id}, 当前ID: ${appId});
  $done({});
}

function unique(arr) {
  return Array.from(new Set(arr));
}
