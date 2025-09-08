import React, { useState, useEffect, useCallback } from 'react';
import { Copy, RefreshCw, CheckCircle, Bone, Baby, Wind } from 'lucide-react';

// =================================================================
// 0. 타입 정의
// =================================================================
type ChartMode = 'appetite' | 'growth' | 'rhinitis';

interface AppetiteFormData {
  mealAmount: string;
  hungerComplaint: string;
  customHunger: string;
  eatingHabits: string;
  abdominalPain: '' | '+' | '-';
  abdominalPainText: string;
  defecationDuringMeal: '' | '+' | '-';
  defecationDuringMealText: string;
  burping: '' | '+' | '-';
  burpingText: string;
  indigestion: '' | '+' | '-';
  indigestionText: string;
  bowelSounds: '' | '+' | '-';
  bowelSoundsText: string;
  nausea: '' | '+' | '-';
  nauseaText: string;
  pickyEating: '' | '+' | '-';
  pickyEatingText: string;
  newFoodAversion: '' | '+' | '-';
  newFoodAversionText: string;
  other: string;
}

interface GrowthFormData {
  growthLastYearNum: string;
  growthLastYearText: string;
  growthHistory: string;
  thelarche: '' | '+' | '-';
  thelarcheText: string;
  pubarche: '' | '+' | '-';
  pubarcheText: string;
  menarche: '' | '+' | '-';
  menarcheText: string;
  testicularDevelopment: '' | '+' | '-';
  testicularDevelopmentText: string;
  fatherGrowthPattern: string;
  motherGrowthPattern: string;
  other: string;
}

interface RhinitisFormData {
  onsetAndAggravatingFactors: string;
  nasalCongestion: '' | '++' | '+' | '-';
  nasalCongestionText: string;
  rhinorrhea: '' | '++' | '+' | '-';
  rhinorrheaText: string;
  sneezing: '' | '++' | '+' | '-';
  sneezingText: string;
  itching: '' | '++' | '+' | '-';
  itchingText: string;
  postNasalDrip: '' | '+' | '-';
  postNasalDripText: string;
  epistaxis: '' | '+' | '-';
  epistaxisText: string;
  mouthBreathing: '' | '+' | '-';
  mouthBreathingText: string;
  snoring: '' | '+' | '-';
  snoringText: string;
  tossingAndTurning: '' | '+' | '-';
  tossingAndTurningText: string;
  bruxism: '' | '+' | '-';
  bruxismText: string;
  findings: string;
  other: string;
}


const initialAppetiteFormData: AppetiteFormData = {
  mealAmount: '', hungerComplaint: '', customHunger: '', eatingHabits: '',
  abdominalPain: '', abdominalPainText: '', defecationDuringMeal: '', defecationDuringMealText: '',
  burping: '', burpingText: '', indigestion: '', indigestionText: '', bowelSounds: '', bowelSoundsText: '',
  nausea: '', nauseaText: '', pickyEating: '', pickyEatingText: '', newFoodAversion: '', newFoodAversionText: '',
  other: '',
};
const initialGrowthFormData: GrowthFormData = {
  growthLastYearNum: '', growthLastYearText: '', growthHistory: '', thelarche: '', thelarcheText: '',
  pubarche: '', pubarcheText: '', menarche: '', menarcheText: '', testicularDevelopment: '',
  testicularDevelopmentText: '', fatherGrowthPattern: '', motherGrowthPattern: '', other: '',
};
const initialRhinitisFormData: RhinitisFormData = {
  onsetAndAggravatingFactors: '', nasalCongestion: '', nasalCongestionText: '', rhinorrhea: '', rhinorrheaText: '',
  sneezing: '', sneezingText: '', itching: '', itchingText: '', postNasalDrip: '', postNasalDripText: '',
  epistaxis: '', epistaxisText: '', mouthBreathing: '', mouthBreathingText: '', snoring: '', snoringText: '',
  tossingAndTurning: '', tossingAndTurningText: '', bruxism: '', bruxismText: '', findings: '', other: '',
};


// =================================================================
// 1. 메인 앱 컴포넌트 (레이아웃 및 모든 상태 관리 총괄)
// =================================================================
const App = () => {
  const [activeView, setActiveView] = useState<ChartMode>('appetite');
  
  const [appetiteFormData, setAppetiteFormData] = useState<AppetiteFormData>(initialAppetiteFormData);
  const [growthFormData, setGrowthFormData] = useState<GrowthFormData>(initialGrowthFormData);
  const [rhinitisFormData, setRhinitisFormData] = useState<RhinitisFormData>(initialRhinitisFormData);

  const [chartParts, setChartParts] = useState<Record<string, string>>({});
  const [interactionOrder, setInteractionOrder] = useState<ChartMode[]>([]);
  const [combinedChart, setCombinedChart] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  const handleChartUpdate = useCallback((view: ChartMode, text: string) => {
    setChartParts(prev => ({ ...prev, [view]: text }));

    if (text && !interactionOrder.includes(view)) {
      setInteractionOrder(prev => [...prev, view]);
    }
  }, [interactionOrder]);
  
  useEffect(() => {
    const newCombinedChart = interactionOrder
      .map(key => chartParts[key])
      .filter(Boolean).join('\n\n');
    setCombinedChart(newCombinedChart);
  }, [chartParts, interactionOrder]);

  const copyToClipboard = async () => {
    if (!combinedChart) return;
    try {
        await navigator.clipboard.writeText(combinedChart);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
        console.error('복사 실패:', err);
    }
  };
  
  const resetAll = () => {
    setAppetiteFormData(initialAppetiteFormData);
    setGrowthFormData(initialGrowthFormData);
    setRhinitisFormData(initialRhinitisFormData);
    setChartParts({});
    setInteractionOrder([]);
  };

  const views = {
    appetite: <AppetiteLossCharting formData={appetiteFormData} setFormData={setAppetiteFormData} onChartUpdate={handleChartUpdate} />,
    growth: <GrowthCharting formData={growthFormData} setFormData={setGrowthFormData} onChartUpdate={handleChartUpdate} />,
    rhinitis: <RhinitisCharting formData={rhinitisFormData} setFormData={setRhinitisFormData} onChartUpdate={handleChartUpdate} />,
  };

  return (
    <div className="max-w-7xl mx-auto p-4 bg-gray-50 min-h-screen font-sans">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">한방소아과 진료 코파일럿</h1>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-3">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">질환 선택</h2>
            <div className="space-y-2">
              <SidebarButton text="식욕부진" icon={<Baby size={18}/>} isActive={activeView === 'appetite'} onClick={() => setActiveView('appetite')} />
              <SidebarButton text="성장" icon={<Bone size={18}/>} isActive={activeView === 'growth'} onClick={() => setActiveView('growth')} />
              <SidebarButton text="비염" icon={<Wind size={18}/>} isActive={activeView === 'rhinitis'} onClick={() => setActiveView('rhinitis')} />
            </div>
          </div>
          <div className="col-span-5">{views[activeView]}</div>
          <div className="col-span-4">
            <div className="sticky top-6 h-[calc(100vh-80px)]">
              <ResultView generatedText={combinedChart} onTextChange={setCombinedChart} onCopy={copyToClipboard} isCopied={isCopied} onReset={resetAll} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


// =================================================================
// 2. 식욕부진 차팅 컴포넌트
// =================================================================
const AppetiteLossCharting = ({ formData, setFormData, onChartUpdate }: { 
    formData: AppetiteFormData;
    setFormData: React.Dispatch<React.SetStateAction<AppetiteFormData>>;
    onChartUpdate: (view: ChartMode, text: string) => void;
}) => {
    const hungerOptions = ['없음', '거의 없음', '있음'];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSymptomChange = (symptomKey: keyof AppetiteFormData, value: string) => {
        setFormData(prev => ({
            ...prev,
            [symptomKey]: prev[symptomKey] === value ? '' : value as '' | '+' | '-',
        }));
    };

    useEffect(() => {
        const generateChart = () => {
            let chart = '#식욕부진\n';
            if (formData.mealAmount) chart += `-식사량 : ${formData.mealAmount}\n`;
            let hungerText = '';
            if (formData.hungerComplaint) hungerText += formData.hungerComplaint;
            if (formData.customHunger) hungerText += (hungerText ? `, ${formData.customHunger}` : formData.customHunger);
            if (hungerText) chart += `-배고픔 호소 : ${hungerText}\n`;
            if (formData.eatingHabits) chart += `-식습관/식사시간 : ${formData.eatingHabits}\n`;

            const symptoms = [
                { key: 'abdominalPain', label: '복통' }, { key: 'defecationDuringMeal', label: '식사중배변' },
                { key: 'burping', label: '트림' }, { key: 'indigestion', label: '식체' },
                { key: 'bowelSounds', label: '장명' }, { key: 'nausea', label: '오심' },
                { key: 'pickyEating', label: '편식' }, { key: 'newFoodAversion', label: '새로운 음식 불호' }
            ];
            const selectedSymptoms = symptoms.map(symptom => {
                const status = formData[symptom.key as keyof AppetiteFormData];
                const textValue = formData[`${symptom.key}Text` as keyof AppetiteFormData];
                if (status) return textValue ? `${symptom.label}(${status}, ${textValue})` : `${symptom.label}(${status})`;
                return null;
            }).filter(Boolean);
            if (selectedSymptoms.length > 0) chart += `-동반 증상 : ${selectedSymptoms.join(' ')}\n`;
            
            if (formData.other.trim()) { chart += `+ ${formData.other.trim()}`; }
            
            onChartUpdate('appetite', chart.trim() === '#식욕부진' ? '' : chart.trim());
        };
        generateChart();
    }, [formData, onChartUpdate]);

    return (
      <div className="space-y-6">
        <div className="bg-blue-50 p-4 rounded-lg space-y-4">
            <h3 className="text-lg font-semibold text-gray-700">📊 기본 정보</h3>
            <InputField label="식사량" name="mealAmount" value={formData.mealAmount} onChange={handleChange} placeholder="예: 평소의 절반 정도" />
            <InputField label="식습관" name="eatingHabits" value={formData.eatingHabits} onChange={handleChange} placeholder="예: 불규칙한 식사, 식사시간이 김" />
            <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">배고픔 호소</label>
                <div className="flex items-center space-x-4 mb-2">
                    {hungerOptions.map((option) => (
                        <label key={option} className="flex items-center space-x-1 cursor-pointer">
                            <input type="radio" name="hungerComplaint" value={option} checked={formData.hungerComplaint === option} onChange={handleChange} className="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                            <span className="text-sm">{option}</span>
                        </label>
                    ))}
                </div>
                <InputField name="customHunger" value={formData.customHunger} onChange={handleChange} placeholder="세부사항 입력..."/>
            </div>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">🤢 동반 증상</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                {[
                    {key: 'abdominalPain', label: '복통'}, {key: 'defecationDuringMeal', label: '식사중배변'},
                    {key: 'burping', label: '트림'}, {key: 'indigestion', label: '식체'},
                    {key: 'bowelSounds', label: '장명'}, {key: 'nausea', label: '오심'},
                    {key: 'pickyEating', label: '편식'}, {key: 'newFoodAversion', label: '새로운 음식 불호'}
                ].map(({key, label}) => (
                    <SymptomChecker 
                        key={key} 
                        label={label} 
                        symptomKey={key as any} 
                        // [수정!] 아래 value 부분의 타입을 명확하게 지정하여 오류 해결
                        value={formData[key as keyof AppetiteFormData] as '' | '+' | '-'}
                        textValue={formData[`${key}Text` as keyof AppetiteFormData]}
                        onStatusChange={handleSymptomChange}
                        onTextChange={handleChange}
                    />
                ))}
            </div>
        </div>
        <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 기타</h3>
            <InputField name="other" value={formData.other} onChange={handleChange} placeholder="추가로 기록할 내용을 입력하세요..."/>
        </div>
      </div>
    );
};


// =================================================================
// 3. 성장 차팅 컴포넌트
// =================================================================
const GrowthCharting = ({ formData, setFormData, onChartUpdate }: {
    formData: GrowthFormData;
    setFormData: React.Dispatch<React.SetStateAction<GrowthFormData>>;
    onChartUpdate: (view: ChartMode, text: string) => void;
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (symptomKey: keyof GrowthFormData, value: string) => {
    setFormData(prev => ({
        ...prev,
        [symptomKey]: prev[symptomKey] === value ? '' : value as '' | '+' | '-',
    }));
  };

  useEffect(() => {
    const generateChart = () => {
      let chart = '#성장\n';
      let growthText = '';
      if (formData.growthLastYearNum) growthText += `${formData.growthLastYearNum}cm/yr`;
      if (formData.growthLastYearText) growthText += (growthText ? `, ${formData.growthLastYearText}` : formData.growthLastYearText);
      if (growthText) chart += `-최근 1년 키 성장 : ${growthText}\n`;
      if (formData.growthHistory) chart += `-성장 관련 진료 : ${formData.growthHistory}\n`;

      const pubertySigns = [
          { key: 'thelarche', label: '가슴멍울' }, { key: 'pubarche', label: '음모' },
          { key: 'menarche', label: '초경' }, { key: 'testicularDevelopment', label: '고환' }
      ];
      const selectedSigns = pubertySigns.map(sign => {
          const status = formData[sign.key as keyof GrowthFormData];
          const textValue = formData[`${sign.key}Text` as keyof GrowthFormData];
          if (status) return textValue ? `${sign.label}(${status}, ${textValue})` : `${sign.label}(${status})`;
          return null;
      }).filter(Boolean);
      if (selectedSigns.length > 0) chart += `-2차 성징 : ${selectedSigns.join(' ')}\n`;

      let parentGrowth = '';
      if (formData.fatherGrowthPattern) parentGrowth += `부(${formData.fatherGrowthPattern})`;
      if (formData.motherGrowthPattern) parentGrowth += (parentGrowth ? ` ` : '') + `모(${formData.motherGrowthPattern})`;
      if (parentGrowth) chart += `-부모 성장 패턴 : ${parentGrowth}\n`;
      
      if (formData.other.trim()) { chart += `+ ${formData.other.trim()}`; }
      onChartUpdate('growth', chart.trim() === '#성장' ? '' : chart.trim());
    };
    generateChart();
  }, [formData, onChartUpdate]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
          <h3 className="text-lg font-semibold text-gray-700">📊 기본 정보</h3>
          <div>
              <label className="text-sm font-medium text-gray-700 mb-1 block">최근 1년 키 성장</label>
              <div className="flex items-center space-x-2">
                  <input type="number" name="growthLastYearNum" value={formData.growthLastYearNum} onChange={handleChange} placeholder="숫자" className="w-24 p-2 border border-gray-300 rounded text-sm"/>
                  <span className="text-gray-600 text-sm">cm/yr</span>
                  <input type="text" name="growthLastYearText" value={formData.growthLastYearText} onChange={handleChange} placeholder="서술형" className="flex-1 p-2 border border-gray-300 rounded text-sm"/>
              </div>
          </div>
          <InputField label="성장 관련 진료" name="growthHistory" value={formData.growthHistory} onChange={handleChange} placeholder="예: 성장클리닉 진료 경험 있음" />
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">♀️♂️ 2차 성징</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {[
                {key: 'thelarche', label: '가슴멍울'}, {key: 'pubarche', label: '음모'},
                {key: 'menarche', label: '초경'}, {key: 'testicularDevelopment', label: '고환'},
            ].map(({key, label}) => (
                <SymptomChecker 
                    key={key} 
                    label={label} 
                    symptomKey={key as any} 
                    // [수정!] 아래 value 부분의 타입을 명확하게 지정하여 오류 해결
                    value={formData[key as keyof GrowthFormData] as '' | '+' | '-'}
                    textValue={formData[`${key}Text` as keyof GrowthFormData]}
                    onStatusChange={handleSymptomChange}
                    onTextChange={handleChange}
                />
            ))}
        </div>
      </div>
      <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">👨‍👩‍👧‍👦 부모 성장 패턴</h3>
          <div className="grid grid-cols-2 gap-4">
              <InputField label="부 (Father)" name="fatherGrowthPattern" value={formData.fatherGrowthPattern} onChange={handleChange} placeholder="예: 고1때 10cm 큼" />
              <InputField label="모 (Mother)" name="motherGrowthPattern" value={formData.motherGrowthPattern} onChange={handleChange} placeholder="예: 초6때 초경, 이후 거의 안 큼" />
          </div>
      </div>
       <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 기타</h3>
          <InputField name="other" value={formData.other} onChange={handleChange} placeholder="추가로 기록할 내용을 입력하세요..."/>
       </div>
    </div>
  );
};


// =================================================================
// 4. 비염 차팅 컴포넌트
// =================================================================
const RhinitisCharting = ({ formData, setFormData, onChartUpdate }: {
    formData: RhinitisFormData;
    setFormData: React.Dispatch<React.SetStateAction<RhinitisFormData>>;
    onChartUpdate: (view: ChartMode, text: string) => void;
}) => {
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSymptomChange = (symptomKey: keyof RhinitisFormData, value: string) => {
    setFormData(prev => ({
        ...prev,
        [symptomKey]: prev[symptomKey] === value ? '' : value as any,
    }));
  };

  useEffect(() => {
    const generateChart = () => {
      let chart = '#비염\n';
      if(formData.onsetAndAggravatingFactors) chart += `-o/s, agg : ${formData.onsetAndAggravatingFactors}\n`;
      
      const mainSymptoms = [
        { key: 'nasalCongestion', label: '코막힘' }, { key: 'rhinorrhea', label: '콧물' },
        { key: 'sneezing', label: '재채기' }, { key: 'itching', label: '소양감' },
      ];

      const formatMainSymptom = (s: {key: string, label: string}) => {
        const status = formData[s.key as keyof RhinitisFormData];
        const textValue = formData[`${s.key}Text` as keyof RhinitisFormData];
        if (!status) return null;
        return textValue ? `${s.label}(${status}, ${textValue})` : `${s.label}(${status})`;
      };

      const severeSymptoms = mainSymptoms
        .filter(s => formData[s.key as keyof RhinitisFormData] === '++')
        .map(formatMainSymptom);

      const otherSymptoms = mainSymptoms
        .filter(s => formData[s.key as keyof RhinitisFormData] && formData[s.key as keyof RhinitisFormData] !== '++')
        .map(formatMainSymptom);

      let symptomLine = '';
      if(severeSymptoms.length > 0) {
        symptomLine += severeSymptoms.join(' ');
        if(otherSymptoms.length > 0) {
          symptomLine += ' / ' + otherSymptoms.join(' ');
        }
      } else if (otherSymptoms.length > 0) {
        symptomLine += otherSymptoms.join(' ');
      }
      if(symptomLine) chart += `-증상 : ${symptomLine}\n`;
      
      const accompanyingSymptoms = [
        { key: 'postNasalDrip', label: '후비루' }, { key: 'epistaxis', label: '코피' },
        { key: 'mouthBreathing', label: '구강호흡' }, { key: 'snoring', label: '코골이' },
        { key: 'tossingAndTurning', label: '뒤척임' }, { key: 'bruxism', label: '이갈이' },
      ];
      const selectedAccompanying = accompanyingSymptoms.map(s => {
        const status = formData[s.key as keyof RhinitisFormData];
        const textValue = formData[`${s.key}Text` as keyof RhinitisFormData];
        if (status) return textValue ? `${s.label}(${status}, ${textValue})` : `${s.label}(${status})`;
        return null;
      }).filter(Boolean);
      if (selectedAccompanying.length > 0) chart += `-동반 증상 : ${selectedAccompanying.join(' ')}\n`;

      if(formData.findings) chart += `-비강/구인두 소견 : ${formData.findings}\n`;
      if (formData.other.trim()) { chart += `+ ${formData.other.trim()}`; }
      
      onChartUpdate('rhinitis', chart.trim() === '#비염' ? '' : chart.trim());
    };
    generateChart();
  }, [formData, onChartUpdate]);

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg space-y-4">
        <InputField label="o/s, agg" name="onsetAndAggravatingFactors" value={formData.onsetAndAggravatingFactors} onChange={handleChange} placeholder="예: 1년 전부터 환절기 심화" />
      </div>
      <div className="bg-purple-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🤧 주증상</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {[
            {key: 'nasalCongestion', label: '코막힘'}, {key: 'rhinorrhea', label: '콧물'},
            {key: 'sneezing', label: '재채기'}, {key: 'itching', label: '소양감'},
          ].map(({key, label}) => (
            <SymptomCheckerThreeOptions
                key={key} label={label} symptomKey={key as any}
                // [수정!] 아래 value 부분의 타입을 명확하게 지정하여 오류 해결
                value={formData[key as keyof RhinitisFormData] as '' | '++' | '+' | '-'}
                textValue={formData[`${key}Text` as keyof RhinitisFormData]}
                onStatusChange={handleSymptomChange}
                onTextChange={handleChange}
            />
          ))}
        </div>
      </div>
      <div className="bg-red-50 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-700 mb-3">🤢 동반 증상</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
          {[
            {key: 'postNasalDrip', label: '후비루'}, {key: 'epistaxis', label: '코피'},
            {key: 'mouthBreathing', label: '구강호흡'}, {key: 'snoring', label: '코골이'},
            {key: 'tossingAndTurning', label: '뒤척임'}, {key: 'bruxism', label: '이갈이'},
          ].map(({key, label}) => (
            <SymptomChecker 
                key={key} label={label} symptomKey={key as any}
                // [수정!] 아래 value 부분의 타입을 명확하게 지정하여 오류 해결
                value={formData[key as keyof RhinitisFormData] as '' | '+' | '-'}
                textValue={formData[`${key}Text` as keyof RhinitisFormData]}
                onStatusChange={handleSymptomChange}
                onTextChange={handleChange}
            />
          ))}
        </div>
      </div>
       <div className="bg-green-50 p-4 rounded-lg">
          <InputField label="비강/구인두 소견" name="findings" value={formData.findings} onChange={handleChange} placeholder="예: pale turbinate, cobble stone throat" />
       </div>
       <div className="bg-yellow-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700 mb-3">📝 기타</h3>
          <InputField name="other" value={formData.other} onChange={handleChange} placeholder="추가로 기록할 내용을 입력하세요..."/>
       </div>
    </div>
  );
};


// =================================================================
// 5. 재사용 UI 컴포넌트
// =================================================================
const SidebarButton = ({ text, icon, isActive, onClick }: { text: string, icon: React.ReactNode, isActive: boolean, onClick: () => void }) => (
    <button onClick={onClick} className={`w-full flex items-center space-x-3 px-4 py-2.5 text-sm font-semibold rounded-lg transition-all ${isActive ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-200'}`}>
        {icon}
        <span>{text}</span>
    </button>
);
const ResultView = ({ generatedText, onTextChange, onCopy, isCopied, onReset }: { 
    generatedText: string;
    onTextChange: (text: string) => void;
    onCopy: () => void;
    isCopied: boolean;
    onReset: () => void;
}) => (
    <div className="bg-gray-100 p-4 rounded-lg shadow-inner h-full flex flex-col">
        <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-700">📋 생성된 차팅</h3>
            <div className="flex space-x-2">
                <button onClick={onCopy} disabled={!generatedText} className={`flex items-center space-x-1.5 px-3 py-2 text-white rounded-md text-sm transition-all duration-200 ${isCopied ? 'bg-green-500' : 'bg-blue-600 hover:bg-blue-700'} disabled:bg-gray-400`}>
                    {isCopied ? <CheckCircle size={16} /> : <Copy size={16} />}
                    <span>{isCopied ? '복사됨!' : '복사'}</span>
                </button>
                <button onClick={onReset} className="flex items-center space-x-1.5 px-3 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm">
                    <RefreshCw size={16} />
                    <span>초기화</span>
                </button>
            </div>
        </div>
        <textarea value={generatedText} onChange={(e) => onTextChange(e.target.value)} className="w-full flex-grow p-4 resize-none text-sm text-gray-800 border-2 border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-blue-500" placeholder="항목을 입력하면 차팅이 자동으로 생성됩니다." />
    </div>
);
const InputField = ({ label, name, value, onChange, placeholder }: { 
    label?: string, 
    name: string, 
    value: string, 
    onChange: (e: any) => void, 
    placeholder: string 
}) => (
    <div>
        {label && <label className="text-sm font-medium text-gray-700 mb-1 block">{label}</label>}
        <input
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
    </div>
);
const SymptomChecker = ({ label, symptomKey, value, textValue, onStatusChange, onTextChange }: { 
    label: string;
    symptomKey: any;
    value: '' | '+' | '-';
    textValue: string;
    onStatusChange: (key: any, value: string) => void;
    onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const getButtonClass = (buttonValue: '+' | '-') => {
        const baseClass = "px-2.5 py-1 rounded border text-sm font-semibold transition-colors";
        if (value === buttonValue) {
            return buttonValue === '+' 
                ? `${baseClass} bg-green-600 text-white border-green-700` 
                : `${baseClass} bg-red-600 text-white border-red-700`;
        }
        return buttonValue === '+'
            ? `${baseClass} bg-white text-green-700 border-gray-300 hover:bg-green-50`
            : `${baseClass} bg-white text-red-700 border-gray-300 hover:bg-red-50`;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 min-w-fit">{label}:</span>
                <div className="flex space-x-2">
                     <button type="button" onClick={() => onStatusChange(symptomKey, '+')} className={getButtonClass('+')}>
                        +
                    </button>
                    <button type="button" onClick={() => onStatusChange(symptomKey, '-')} className={getButtonClass('-')}>
                        -
                    </button>
                </div>
            </div>
            {(value === '+' || value === '-') && (
                <input
                    type="text"
                    name={`${symptomKey}Text`}
                    placeholder={`${label} 세부사항...`}
                    value={textValue}
                    onChange={onTextChange}
                    className="w-full p-1.5 border border-gray-300 rounded text-xs"
                />
            )}
        </div>
    );
};

const SymptomCheckerThreeOptions = ({ label, symptomKey, value, textValue, onStatusChange, onTextChange }: {
    label: string;
    symptomKey: any;
    value: '' | '++' | '+' | '-';
    textValue: string;
    onStatusChange: (key: any, value: string) => void;
    onTextChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
    const options: Array<'++' | '+' | '-'> = ['++', '+', '-'];
    const getButtonClass = (optionValue: '++' | '+' | '-') => {
        const baseClass = "px-2.5 py-1 rounded border text-sm font-semibold transition-colors";
        const colorClasses = {
            '++': 'bg-red-600 text-white border-red-700',
            '+': 'bg-green-600 text-white border-green-700',
            '-': 'bg-gray-500 text-white border-gray-600',
        };
        const hoverClasses = {
            '++': 'bg-white text-red-700 border-gray-300 hover:bg-red-50',
            '+': 'bg-white text-green-700 border-gray-300 hover:bg-green-50',
            '-': 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100',
        };
        return value === optionValue ? `${baseClass} ${colorClasses[optionValue]}` : `${baseClass} ${hoverClasses[optionValue]}`;
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700 min-w-fit">{label}:</span>
                <div className="flex space-x-2">
                    {options.map(opt => (
                        <button key={opt} type="button" onClick={() => onStatusChange(symptomKey, opt)} className={getButtonClass(opt)}>
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
            {value && (
                <input
                    type="text"
                    name={`${symptomKey}Text`}
                    placeholder={`${label} 세부사항...`}
                    value={textValue}
                    onChange={onTextChange}
                    className="w-full p-1.5 border border-gray-300 rounded text-xs"
                />
            )}
        </div>
    );
};


export default App;