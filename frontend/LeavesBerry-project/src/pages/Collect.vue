<!DOCTYPE html>
<html lang="zh-CN">

<head>
	<meta charset="UTF-8" />
	<title>收藏</title>
	<link rel="stylesheet" href="/static/Style/CommonStyle.css">
</head>

<body>
	<div id="body">
		<div id="collect-list"></div>
	</div>
	<!--home page-->
	<script src="/static/Script/CommonScript.js"></script>
	<script>
		let User = 100000;

		function TestError(Data) {
			if (Data.error) {
				console.log(Data.error);
				return false;
			}
			else if (Data.msg) {
				console.log(Data.msg);
				return true;
			}
			else {
				return true;
			}
		}

		async function GetCollects() {
			const Res = await fetch('/GetCollects', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ id: User })
			});
			const Data = await Res.json();
			if (!TestError(Data)) {
				for (let [Url, Title] of Object.entries(Data)) {
					const CollectLink = document.createElement('a');
					CollectLink.href = Url;
					CollectLink.textContent = Title;
					document.appendChild(CollectLink);
				}
			}


		}
	</script>
</body>

</html>