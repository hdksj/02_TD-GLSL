uniform float uLow;
uniform float uTime;
uniform float uShapeIndex;

out vec4 fragColor;

// 円のSDF
float sdfCircle(vec2 p,float r){
	return length(p)-r;
}

// 正方形のSDF
float sdfBox(vec2 p,float s){
	vec2 d=abs(p)-vec2(s);
	return length(max(d,0.))+min(max(d.x,d.y),0.);
}

// 六角形のSDF
float sdfHex(vec2 p,float r){
	vec2 q=abs(p);
	return max(q.x*.866025+q.y*.5,q.y)-r;
}

void main(){
	vec2 uv=vUV.st-.5;
	uv.x*=uTDOutputInfo.res.x/uTDOutputInfo.res.y;// アスペクト補正
	
	// ゆっくり回転
	float angle=uTime*.2;
	vec2 rot=vec2(
		uv.x*cos(angle)-uv.y*sin(angle),
		uv.x*sin(angle)+uv.y*cos(angle)
	);
	
	// uLowでサイズがパルス
	float baseSize=.25;
	float size=baseSize+uLow*.08;
	
	// シェイプ選択
	float d=0.;
	int shape=int(uShapeIndex);
	if(shape==0){
		d=sdfCircle(rot,size);
	}else if(shape==1){
		d=sdfBox(rot,size*.85);
	}else{
		d=sdfHex(rot,size);
	}
	
	// シャープなエッジ
	float fill=step(0.,-d);
	
	fragColor=vec4(vec3(fill),1.);
}