uniform float uLow;
uniform float uMid;
uniform float uHigh;
uniform float uTime;

out vec4 fragColor;

float hash(float n){
	return fract(sin(n)*43758.5453);
}

float noise(float p){
	float i=floor(p);
	float f=fract(p);
	float u=f*f*(3.-2.*f);
	return mix(hash(i),hash(i+1.),u);
}

void main(){
	vec2 uv=vUV.st;
	
	// 走査速度：uLowで加速
	float scanSpeed=.3+uLow*2.;
	
	// 走査位置（0〜1をループ）
	float scanPos=fract(uTime*scanSpeed);
	
	// 各走査線の輝度をノイズで決める
	float lineOffset=sin(uv.y*12.+uTime*1.5)*.008
	+noise(uv.y*3.+uTime*.8)*.015;
	float lineNoise=noise((uv.y+lineOffset)*800.+uTime*.5);
	
	// 走査線の通過判定
	float scanWidth=.08+uLow*.15;// ビートで走査線が太くなる
	float scanDist=abs(uv.y-scanPos);
	float scanLine=smoothstep(scanWidth,0.,scanDist);
	
	// 走査済みの領域に残像ノイズを残す
	float trailNoise=noise(uv.y*60.+uTime*.2);
	float trailMask=step(scanPos,uv.y)==1.?0.:1.;// 走査前は暗い
	float trail=trailNoise*trailMask*.15;
	
	// uHighで画面全体にフリッカーノイズを加える
	float flicker=noise(uv.y*120.+uTime*8.)*uHigh*.4;
	
	// uMidで輝度の閾値をシフト
	float threshold=.65-uMid*.3;
	float baseNoise=step(threshold,lineNoise);
	
	// 合成
	float brightness=scanLine*baseNoise+trail+flicker;
	brightness=clamp(brightness,0.,1.);
	
	fragColor=vec4(vec3(brightness),1.);
}