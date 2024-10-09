import http from 'k6/http';
import { sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/formdata/0.0.2/index.js';

const img1 = open("./test.html");

export const options = {
  // A number specifying the number of VUs to run concurrently.
  vus: 500,
  // A string specifying the total duration of the test run.
  duration: '300s',

  // The following section contains configuration options for execution of this
  // test script in Grafana Cloud.
  //
  // See https://grafana.com/docs/grafana-cloud/k6/get-started/run-cloud-tests-from-the-cli/
  // to learn about authoring and running k6 test scripts in Grafana k6 Cloud.
  //
  // ext: {
  //   loadimpact: {
  //     // The ID of the project to which the test is assigned in the k6 Cloud UI.
  //     // By default tests are executed in default project.
  //     projectID: "",
  //     // The name of the test in the k6 Cloud UI.
  //     // Test runs with the same name will be grouped.
  //     name: "script.js"
  //   }
  // },

  // Uncomment this section to enable the use of Browser API in your tests.
  //
  // See https://grafana.com/docs/k6/latest/using-k6-browser/running-browser-tests/ to learn more
  // about using Browser API in your test scripts.
  //
  // scenarios: {
  //   // The scenario name appears in the result summary, tags, and so on.
  //   // You can give the scenario any name, as long as each name in the script is unique.
  //   ui: {
  //     // Executor is a mandatory parameter for browser-based tests.
  //     // Shared iterations in this case tells k6 to reuse VUs to execute iterations.
  //     //
  //     // See https://grafana.com/docs/k6/latest/using-k6/scenarios/executors/ for other executor types.
  //     executor: 'shared-iterations',
  //     options: {
  //       browser: {
  //         // This is a mandatory parameter that instructs k6 to launch and
  //         // connect to a chromium-based browser, and use it to run UI-based
  //         // tests.
  //         type: 'chromium',
  //       },
  //     },
  //   },
  // }
};

// The function that defines VU logic.
//
// See https://grafana.com/docs/k6/latest/examples/get-started-with-k6/ to learn more
// about authoring k6 scripts.
//
export default function() {
  // const url1 = 'http://chattest.shomvob.co:8080/v1/chat/rooms/65683891cbb60fe409f2d724';
  // // const payload = JSON.stringify({
    // // email: 'naqib3110@gmail.com'
  // // });

  // const params1 = {
    // headers: {
      // 'Content-Type': 'application/json',
	  // 'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJObHllODlSU1lIcy03RHkzdmZnQyJ9.eyJuaWNrbmFtZSI6Im5hcWliMzExMCIsIm5hbWUiOiJuYXFpYjMxMTBAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzU4NTYxYzQ1OTFmMjBlZDI0ZTg0M2M3ZjEzNjA0MjhlP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGbmEucG5nIiwidXBkYXRlZF9hdCI6IjIwMjMtMTItMDhUMDA6MDQ6MTkuMzg2WiIsImVtYWlsIjoibmFxaWIzMTEwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly8xNzI0LWNoYXQudXMuYXV0aDAuY29tLyIsImF1ZCI6IlNRZkRsZ3YxVzlEaVlsUWxySktBd2JqcWQ2eWJ3c3hXIiwiaWF0IjoxNzAxOTkzODU5LCJleHAiOjE3MDIwMjk4NTksInN1YiI6ImF1dGgwfDY1NjgzODkxY2JiNjBmZTQwOWYyZDcyNCJ9.DWkxAjayVNePjBve32xfCmavseBqJDiKTCYVnWhbs1nhxmq22ejZN6fDHiD331uaO03Kwbqu-m5-VmgztSQXTTmOWSpZ3zpu1eS4JTw4B2Xb4H0EkCDg2WN05pnc0vJu6tja_WfZps0JBPFhosRXoMRT_BpyvguOHswg0cAOEsY7mXoLtPQwpBQKzQpj9H-7fOD5xj0yIY8zMuRirlOgM0fdeRzT27edpOlsDlnxAVuif_8AwOLNY53EJIKJFsLG3mEp89yj6ozllxywkSisul4vFtFPse_DE8L0vt4s1-ME5MV7ZugkidwnLAEe58qrI5VhhlO-45HOGittwbO2Kw'
    // },
  // };
  
  // const url2 = 'http://chattest.shomvob.co:8080/v1/auth/login';
  // const payload2 = JSON.stringify({
    // email: 'naqib3110@gmail.com',
    // more_email: '2C*GZ8Z*6#z%aah',
  // });

  // const params2 = {
    // headers: {
      // 'Content-Type': 'application/json',
	  
    // },
  // };
  
  // const fd = new FormData();
  // fd.append('files', http.file(img1, 'test.png', 'image/png'));
  // console.log('img1', fd.body());
  const url3 = 'http://chattest.shomvob.co:8080/v1/upload';
  const data = {
    files: http.file(img1, 'test.html', 'text/html'),
  };

  const params3 = {
    headers: {
	  'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IkJObHllODlSU1lIcy03RHkzdmZnQyJ9.eyJuaWNrbmFtZSI6Im5hcWliMzExMCIsIm5hbWUiOiJuYXFpYjMxMTBAZ21haWwuY29tIiwicGljdHVyZSI6Imh0dHBzOi8vcy5ncmF2YXRhci5jb20vYXZhdGFyLzU4NTYxYzQ1OTFmMjBlZDI0ZTg0M2M3ZjEzNjA0MjhlP3M9NDgwJnI9cGcmZD1odHRwcyUzQSUyRiUyRmNkbi5hdXRoMC5jb20lMkZhdmF0YXJzJTJGbmEucG5nIiwidXBkYXRlZF9hdCI6IjIwMjMtMTItMDhUMTM6MzY6MzYuOTQzWiIsImVtYWlsIjoibmFxaWIzMTEwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiaXNzIjoiaHR0cHM6Ly8xNzI0LWNoYXQudXMuYXV0aDAuY29tLyIsImF1ZCI6IlNRZkRsZ3YxVzlEaVlsUWxySktBd2JqcWQ2eWJ3c3hXIiwiaWF0IjoxNzAyMDQyNTk2LCJleHAiOjE3MDIwNzg1OTYsInN1YiI6ImF1dGgwfDY1NjgzODkxY2JiNjBmZTQwOWYyZDcyNCJ9.tECogOtWT7TWbkYuILSFtuEdwMUsT3Z7JgpFU_W8JkRtLeCfgNGNB78YOulri7kzdSDA5jFHwR4JCPXoe5c4yVTomp4fIm6NNPmdQPJ7v2BFWCfkvAh3QDoJ9VsZ6YoIJmDC9DJZd1ezKTcCbKgmUSXXW1hK6r-bUfk_cIN3iF5nNo0GoW2cxaWZgJZ7uLhqNUM9HuSeE7h-zcz8tM2nNZKtA--DLfgIHMqHZgSAsm1vFjWTIkkcV1XtkytKPiUeEiZZzzgutGgaVHNobKB9N1dLWFsfdZOTzYIR1I2WU0KaqAiubcEztVH4t3wvxgjX8wgkeANgRa1RmONur1Ea4g'
    },
	// 'Content-Type': 'multipart/form-data; boundary=' + fd.boundary
  };

  // http.get(url1, params1);
  // http.post(url2, payload2, params2);
  http.post(url3, data, params3);
}