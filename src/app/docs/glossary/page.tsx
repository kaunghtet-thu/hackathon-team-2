export const metadata = {
	title: "Semiconductor Glossary • AstraSemi AI Helper",
	description: "Glossary of common semiconductor terms with explanations in English and Korean.",
};

export default function GlossaryPage() {
	return (
		<div className="mx-auto max-w-4xl space-y-6">
			<header>
				<h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
					Semiconductor Glossary
				</h1>
				<p className="mt-2 text-sm text-muted-foreground">
					Common semiconductor terms with explanations in English and Korean.
				</p>
			</header>
			<div className="space-y-4">
				<div>
					<h2 className="text-xl font-medium">Semiconductor (반도체)</h2>
					<p><strong>English:</strong> A material that has electrical conductivity between that of a conductor and an insulator, commonly used in electronic devices.</p>
					<p><strong>Korean:</strong> 전도체와 절연체 사이의 전기 전도도를 갖는 물질로, 전자 장치에 일반적으로 사용됩니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Transistor (트랜지스터)</h2>
					<p><strong>English:</strong> A semiconductor device used to amplify or switch electronic signals and electrical power.</p>
					<p><strong>Korean:</strong> 전자 신호와 전력을 증폭하거나 스위칭하는 데 사용되는 반도체 장치입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Wafer (웨이퍼)</h2>
					<p><strong>English:</strong> A thin slice of semiconductor material, such as silicon, used to fabricate integrated circuits.</p>
					<p><strong>Korean:</strong> 실리콘과 같은 반도체 물질의 얇은 조각으로, 집적 회로를 제조하는 데 사용됩니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Integrated Circuit (IC) (집적 회로)</h2>
					<p><strong>English:</strong> A set of electronic circuits on one small flat piece (or "chip") of semiconductor material, normally silicon.</p>
					<p><strong>Korean:</strong> 반도체 물질의 작은 평평한 조각(또는 "칩")에 전자 회로의 집합입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">MOSFET (모스펫)</h2>
					<p><strong>English:</strong> Metal-Oxide-Semiconductor Field-Effect Transistor, a type of transistor used in digital and analog circuits.</p>
					<p><strong>Korean:</strong> 디지털 및 아날로그 회로에 사용되는 트랜지스터의 한 유형인 금속-산화물-반도체 전계 효과 트랜지스터입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Photolithography (포토리소그래피)</h2>
					<p><strong>English:</strong> A process used in microfabrication to pattern parts of a thin film or the bulk of a substrate using light.</p>
					<p><strong>Korean:</strong> 빛을 사용하여 얇은 필름이나 기판의 일부를 패턴화하는 미세 가공에 사용되는 공정입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Doping (도핑)</h2>
					<p><strong>English:</strong> The intentional introduction of impurities into a semiconductor to modify its electrical properties.</p>
					<p><strong>Korean:</strong> 반도체의 전기적 특성을 수정하기 위해 불순물을 의도적으로 도입하는 과정입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">Band Gap (밴드 갭)</h2>
					<p><strong>English:</strong> The energy difference between the top of the valence band and the bottom of the conduction band in a semiconductor.</p>
					<p><strong>Korean:</strong> 반도체에서 원자가 밴드의 상단과 전도 밴드의 하단 사이의 에너지 차이입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">CMOS (컴플리먼터리 모스)</h2>
					<p><strong>English:</strong> Complementary Metal-Oxide-Semiconductor, a technology for constructing integrated circuits using complementary pairs of p-type and n-type MOSFETs.</p>
					<p><strong>Korean:</strong> p형과 n형 MOSFET의 상보 쌍을 사용하여 집적 회로를 구성하는 기술입니다.</p>
				</div>
				<div>
					<h2 className="text-xl font-medium">FinFET (핀펫)</h2>
					<p><strong>English:</strong> A type of transistor with a fin-like structure that improves performance and reduces leakage current.</p>
					<p><strong>Korean:</strong> 성능을 향상시키고 누설 전류를 줄이는 핀 모양 구조의 트랜지스터 유형입니다.</p>
				</div>
			</div>
		</div>
	);
}