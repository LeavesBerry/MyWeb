<template>
	<div class="init-page">
		<audio id="background-music" src="/static/Sound/LeavesBerry.mp3" loop></audio>
		<div class="container">
			<div id="welcome-container">
				<!--welcome animation-->
				<img id="drop-crystal-img" src="/static/Picture/Water.png" alt="掉落水晶图">
				<img id="bottom-plumule-img" src="/static/Picture/Sprout.png" alt="底部芽图">
				<img class="welcome" id="center-leaf-img" src="/static/Picture/Leaf.png" alt="中心叶图">
				<img class="welcome" id="send-img" src="/static/Picture/Send.png" alt="种子图">
				<p class="welcome-title welcome" id="LB">✦ 叶 果 ✦</p>
				<p class="welcome-title welcome" id="CE">点 击 任 意 处 进 入</p>
				<div class="leaves-img-box" id="box-left-up">
					<img class="leaves-img welcome" src="/static/Picture/Leaves.png" alt="左图">
				</div>
				<div class="leaves-img-box" id="box-left-down">
					<img class="leaves-img welcome" src="/static/Picture/Leaves.png" alt="左图">
				</div>
				<div class="leaves-img-box" id="box-right-up">
					<img class="leaves-img welcome" src="/static/Picture/Leaves.png" alt="右图">
				</div>
				<div class="leaves-img-box" id="box-right-down">
					<img class="leaves-img welcome" src="/static/Picture/Leaves.png" alt="右图">
				</div>
			</div>
			<!--home page-->
		</div>
		<script src="/static/Script/CommonScript.js"></script>
		<script src="/static/Script/InitialPageScript.js"></script>
	</div>
</template>