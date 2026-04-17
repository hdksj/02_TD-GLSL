uniform float uLow;
uniform float uMid;
uniform float uHigh;
uniform float uTime;

out vec4 fragColor;

float hash(vec2 p){
	return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);
}

float hash2(float n){
	return fract(sin(n)*43758.5453);
}

float noise(vec2 p){
	vec2 i=floor(p);
	vec2 f=fract(p);
	vec2 u=f*f*(3.-2.*f);
	return mix(
		mix(hash(i+vec2(0,0)),hash(i+vec2(1,0)),u.x),
		mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),
		u.y
	);
}

vec2 flowField(vec2 p,float t){
	float angle=noise(p*2.+t*.3)*6.2832*2.;
	return vec2(cos(angle),sin(angle));
}

void main(){
	vec2 uv=vUV.st-.5;
	
	float energy=uLow*.5+uMid*.3+uHigh*.2;
	float flowSpeed=.4+uLow*1.2;
	
	float brightness=0.;
	const float COUNT=10.;
	
	for(float i=0.;i<COUNT;i++){
		float seed=hash2(i);
		float seed2=hash2(i+100.);
		float seed3=hash2(i+200.);
		float seed4=hash2(i+300.);
		
		// xy位置（ノイズ場で流す）
		vec2 origin=vec2(seed,seed2)-.5;
		float t=uTime*flowSpeed+seed*10.;
		vec2 flow=flowField(origin+t*.1,t);
		vec2 pos=origin+flow*(.1+energy*.15);
		
		// z値（0=手前, 1=奥）
		// uLowで奥の粒子が手前に引き寄せられる
		float zBase=(seed3+seed4)*.5;
		float zPull=uLow*(1.-zBase)*.8;// 奥にいるほど大きく引き寄せ
		float zWobble=(uMid*.2+uHigh*.1)
		*sin(uTime*2.+seed*6.2832);
		float z=clamp(zBase-zPull+zWobble,.01,1.);
		
		// z値でサイズをスケール（手前=大, 奥=小）
		float radius=mix(.08,.001,z);
		
		// jitter（高音の揺れ）
		float jitter=uHigh*.03;
		pos+=(vec2(hash(vec2(i,t)),hash(vec2(i+50.,t)))-.5)*jitter;
		
		// 距離関数で粒子を描画
		float d=length(uv-pos);
		float pt=step(d,radius);
		
		brightness+=pt;
	}
	
	brightness=clamp(brightness,0.,1.);
	
	fragColor=vec4(vec3(brightness),1.);
}