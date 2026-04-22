uniform float uLow;
uniform float uTime;

out vec4 fragColor;

float hash(float n){
	return fract(sin(n)*43758.5453);
}

void main(){
	vec2 uv=vUV.st;
	
	// --- モザイク ---
	float blockCount=mix(400.,4.,pow(uLow,.5));
	vec2 blockedUV=floor(uv*blockCount)/blockCount;
	
	// --- グリッチ・スライス ---
	float sliceCount=20.;// スライス数
	float sliceIndex=floor(uv.y*sliceCount);// 行インデックス
	float sliceRand=hash(sliceIndex+floor(uTime*8.));// 時間でランダムが変わる
	
	// uLowが高いときだけスライスがずれる
	float offsetX=(sliceRand-.5)*uLow*.6;
	blockedUV.x=fract(blockedUV.x+offsetX);
	
	vec4 color=texture(sTD2DInputs[0],blockedUV);
	
	fragColor=vec4(color.rgb,1.);
}