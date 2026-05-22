// src/pages/cafe-marketing.tsx
import React, { useState } from 'react';
import Head from 'next/head';
import '../styles/cafe-marketing.css';

const CHECKLIST_CONTENT = `# 📋 [무료 배포] 월 매출 30%를 올리는 '동네 카페 네이버 플레이스 7단계 세팅 체크리스트'

> **대상**: 온라인 광고비는 부담스럽고, 네이버 지도 노출을 통해 동네 단골손님을 늘리고 싶은 개인 카페 사장님.
> **목표**: 1시간 이내에 세팅을 완료하고, 네이버 지도 검색 시 상위 노출 확률을 2배 이상 높임.

---

## 🏁 들어가며: 왜 '네이버 플레이스'인가요?
동네 주민들이 새로운 카페를 찾을 때 가장 먼저 하는 행동은 **네이버 지도(플레이스) 검색**입니다. 인스타그램 광고판보다 플레이스 상위 노출 하나가 가져오는 신규 고객 유입 효과가 최소 5배 이상 높습니다. 
대행사에 매달 100만 원씩 주지 않고, 사장님이 직접 1시간만 투자해서 세팅할 수 있는 실전 가이드를 시작합니다.

---

## 🛠️ 네이버 플레이스 7단계 체크리스트

### 1단계: 검색 노출을 극대화하는 '업체명 & 상세설명' 키워드 매칭
네이버 알고리즘은 사용자의 검색어와 업체명, 상세설명의 일치도를 가장 중요하게 봅니다.
*   **[Action] 업체명에 합법적인 핵심 키워드 추가하기**
    *   단순히 '카페 에이'라고 적는 대신, 네이버 가이드라인을 어기지 않는 선에서 브랜드 정체성을 명확히 나타내세요.
    *   *추천 구조*: '카페 에이' ➔ '카페 에이 성수점' 또는 '카페 에이 수플레 팬케이크' (실제 제공하는 대표 메뉴명 추가)
*   **[Action] 상세설명 첫 3줄에 타겟팅 키워드 배치**
    *   소비자가 검색할 만한 키워드들을 조합해 스토리텔링식으로 설명문을 채우세요.
    *   *나쁜 예*: "안녕하세요. 정성스럽게 커피를 내리는 카페 에이입니다." (검색 키워드 전무)
    *   *좋은 예*: "성수동 데이트 코스를 찾는 분들을 위해 스페셜티 드립커피와 매일 아침 굽는 수플레 팬케이크를 제공하는 성수역 디저트 카페 에이입니다."

---

### 2단계: 클릭률을 200% 올리는 '대표 사진' 3종 배치
검색 결과에 우리 카페가 노출되더라도 사진이 매력적이지 않으면 클릭하지 않고 지나쳐 버립니다.
*   **[Action] 첫 번째 대표 사진: '시그니처 메뉴' 클로즈업 샷**
    *   카페 인테리어 사진보다 군침 도는 대표 디저트나 거품이 부드러운 라떼 아트를 대표 이미지로 지정하십시오. (초점은 메뉴에 맞추고 배경은 아웃포커싱)
*   **[Action] 두 번째 사진: '가장 아늑한/감성적인 좌석' 전경**
    *   카페의 전체 모습보다는 손님이 앉아서 책을 읽거나 대화를 나누고 싶어지는 가장 예쁜 '시그니처 좌석' 뷰를 보여주세요.
*   **[Action] 세 번째 사진: '사장님 또는 바리스타의 일하는 모습'**
    *   정성껏 커피를 추출하거나 디저트를 굽는 모습을 보여주어 신뢰도를 높이고 정체성을 강조합니다.

---

### 3단계: 플레이스 검색 최적화 '대표 키워드 5개' 선정
플레이스 등록 정보 관리자 페이지에서 설정하는 5개의 대표 키워드는 노출의 핵심 나침반입니다.
*   **[Action] 대형 키워드 2개 + 틈새(롱테일) 키워드 3개 조합**
    *   [대형] 인근 동네명 + 카페 (예: 성수역 카페, 성수동 디저트)
    *   [틈새] 구체적 메뉴/목적 (예: 성수동 스페셜티, 성수역 조용한 카페, 성수 수플레)
*   *주의*: 우리 매장에서 전혀 팔지 않거나 관련 없는 키워드는 클릭률 저하 및 어뷰징 필터링의 원인이 됩니다.

---

### 4단계: 첫 방문을 유도하는 '쿠폰 이벤트' 상시 실행
노출과 클릭을 확보했다면, 이제 실제 매장에 방문하게 만들 강력한 '미끼(Trigger)'가 필요합니다.
*   **[Action] 'N예약/플레이스 저장 시 쿠폰 지급' 이벤트 등록**
    *   네이버 스마트플레이스 마케팅 도구에서 쿠폰을 발행하세요.
    *   *추천 혜택*: "플레이스 저장 시 '대표 수제 쿠키 1개 증정' 또는 '첫 방문 아메리카노 1,000원 할인 쿠폰'"
    *   *심리적 효과*: 공짜 혜택을 놓치기 싫어하는 고객의 심리(Loss Aversion)를 자극하여 저장하기 수와 방문율을 동시에 높입니다.

---

### 5단계: 알고리즘에 활력을 불어넣는 '새소식' 주 1회 작성
네이버는 꾸준히 정보가 업데이트되는 매장을 플레이스 상위 노출에 우대합니다.
*   **[Action] 매주 1회 단순 소식 등록하기**
    *   "이번 주 신선한 원두 라인업 안내", "비 오는 날 어울리는 초코 브라우니 구워졌습니다" 등 사소한 소식이라도 등록하세요.
    *   소식 작성 시 4단계에서 만든 쿠폰을 하단에 첨부하면 전환 시너지가 극대화됩니다.

---

### 6단계: 검색 랭킹을 결정하는 '영수증/블로그 리뷰' 설계
리뷰 수와 평점, 그리고 리뷰 내 텍스트는 로컬 SEO의 가장 큰 점수판입니다.
*   **[Action] 테이블 텐트 영수증 리뷰 유도**
    *   "영수증 리뷰 참여 시 수제 초콜릿 증정" 안내판을 테이블과 결제 포스 앞에 배치하십시오.
*   **[Action] 리뷰 답변에 '동네명 키워드' 반복 삽입**
    *   고객 리뷰에 답글을 달 때 동네명을 자연스럽게 노출하세요.
    *   *예시*: "리뷰 감사합니다! 앞으로도 성수동에서 가장 맛있는 스페셜티 커피를 대접하는 카페 에이가 되겠습니다." (답변글 역시 검색 로봇이 수집함)

---

### 7단계: 매장 정보 정확성 100% 매칭 (Friction 제거)
고객이 매장을 방문할 때 겪는 작은 방해 요소를 모두 제거해야 합니다.
*   **[Action] 3대 정보 완벽 일치 확인**
    1.  **영업시간**: 임시 휴무나 공휴일 영업 여부를 플레이스 소식에 즉시 업데이트하십시오.
    2.  **주차 여부**: "주차 불가 (인근 공영주차장 이용 권장)" 등 아주 상세히 적으십시오.
    3.  **찾아오시는 길**: "성수역 3번 출구 도보 5분, 올리브영 골목 우회전 후 50m"와 같이 텍스트로 아주 친절히 묘사하세요.

---

## 📈 실천 계획표 (Checklist Summary)

| 단계 | 작업 내용 | 소요 시간 |
| :--- | :--- | :--- |
| **1단계** | 업체명 및 첫 3줄 키워드 배치 | 10분 |
| **2단계** | 고화질 시그니처 메뉴 사진 교체 | 15분 |
| **3단계** | 로컬 틈새 키워드 5개 설정 | 5분 |
| **4단계** | 플레이스 저장용 할인/증정 쿠폰 발행 | 10분 |
| **5단계** | 주간 새소식 작성 예약 | 10분 |
| **6단계** | 포스기 앞 영수증 리뷰 안내판 부착 | 5분 |
| **7단계** | 주차 및 길찾기 텍스트 상세화 | 5분 |

---

## 🎁 보너스: 원가율 & 마진 자동 계산 템플릿
재료비 대비 마진율을 자동으로 계산해 주는 스프레드시트를 사본 만들기 하셔서 무료로 활용해 보세요!
👉 [카페 마진율 계산기 스프레드시트 이동 (클릭)](https://docs.google.com/spreadsheets/d/1_yZ8_sJ5qfP_0nI0_JbQJ_Mszw5cRzQj6f_lT2R3U4I/copy)

---

### 📣 더 높은 매출 상승을 원하시나요?
체크리스트를 적용했음에도 여전히 주말 매출이 걱정되신다면, 1:1 맞춤형 **동네 상권 정밀 진단 서비스(무료)**를 신청하세요. 선착순 10분께 사장님 카페만의 경쟁사 분석 리포트를 보내드립니다.
👉 [무료 상권 진단 신청하기](mailto:support@azitart.com?subject=동네카페 상권진단 신청)`;

const CafeMarketingPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [cafeName, setCafeName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleScrollToForm = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!name.trim()) {
      setErrorMsg('이름을 입력해 주세요.');
      return;
    }
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg('올바른 이메일 주소를 입력해 주세요.');
      return;
    }
    if (!cafeName.trim()) {
      setErrorMsg('카페 이름을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    
    // Premium interactive delay simulation (1.2s)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setIsSubmitted(true);
      
      // Save lead information mock log
      console.log('Lead collected:', { name, email, cafeName, phoneNumber });
    } catch (err) {
      setErrorMsg('제출 중 오류가 발생했습니다. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDownloadChecklist = () => {
    // Dynamically download checklist content as a markdown file for the premium "WOW" factor
    const blob = new Blob([CHECKLIST_CONTENT], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', '[무료배포] 동네_카페_네이버_플레이스_7단계_세팅_체크리스트.md');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <Head>
        <title>[무료 배포] 월 매출 30%를 올리는 동네 카페 네이버 플레이스 7단계 세팅 체크리스트</title>
        <meta name="description" content="광고비 0원으로 만드는 단골 지도 세팅 비법! 하루 30분만 투자하면 사장님이 직접 세팅할 수 있는 핵심 7단계 가이드 및 마진율 계산기를 즉시 다운로드하세요." />
        <meta property="og:title" content="월 매출 30% 상승 동네 카페 플레이스 7단계 치트시트" />
        <meta property="og:description" content="대행사에 100만 원 뿌리기 전에 반드시 세팅해야 할 네이버 플레이스 가이드북 무료 배포" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Header */}
      <header className="landing-header">
        <div className="container header-flex">
          <div className="logo" id="landing-logo">
            <span>☕</span> 플레이스 마케팅
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container hero-content">
            <span className="hero-tag">🎁 선착순 100% 무료 배포 중</span>
            <h1 className="hero-title" id="main-hero-title">
              광고비 한 푼 안 쓰고 3개월 만에<br />
              단골 고객 매출만 2배 늘린 동네 카페 마케팅 법칙
            </h1>
            <p className="hero-desc">
              조급한 마음에 인스타그램 광고를 켜거나 아파트 전단지를 돌리지 마세요.<br />
              하루 30분, 동네 주민 90%가 검색하는 네이버 플레이스 세팅 하나로<br />
              매주 찾아오는 '찐 단골' 100명을 확실하게 만드는 실전 매뉴얼을 드립니다.
            </p>
            <button className="hero-cta-btn" onClick={handleScrollToForm} id="hero-cta">
              무료 치트시트 다운로드하고 오늘부터 단골 늘리기
            </button>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="benefits-section">
          <div className="container">
            <div className="section-header">
              <span className="section-subtitle">Checklist Benefits</span>
              <h2 className="section-title">이 체크리스트로 얻게 될 4가지 핵심 혜택</h2>
            </div>
            
            <div className="benefits-grid">
              <div className="benefit-card">
                <div className="benefit-icon">🔍</div>
                <h3 className="benefit-title">상위 검색 노출 극대화</h3>
                <p className="benefit-desc">
                  네이버 알고리즘이 우대하는 ‘업체명 & 상세설명’ 키워드 조합 공식과 매칭 방식을 통해 인근 지역 검색 시 상위 노출 확률을 극대화합니다.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">📸</div>
                <h3 className="benefit-title">클릭률을 200% 올리는 사진 구성</h3>
                <p className="benefit-desc">
                  아무리 상위에 노출되어도 클릭하지 않으면 무용지물. 고객의 손가락을 멈추게 하는 메뉴, 공간, 일하는 모습의 3대 사진 규칙을 배웁니다.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">🎟️</div>
                <h3 className="benefit-title">이탈 없는 단골 락인 쿠폰 설계</h3>
                <p className="benefit-desc">
                  단순한 10% 할인이 아닌 손님의 심리를 자극하여 재방문을 유도하는 ‘플레이스 저장/예약 쿠폰’의 효율적인 발행 방식과 이벤트를 안내합니다.
                </p>
              </div>

              <div className="benefit-card">
                <div className="benefit-icon">📊</div>
                <h3 className="benefit-title">보너스: 원가 및 마진 자동 계산기</h3>
                <p className="benefit-desc">
                  신메뉴 개발이나 원가 조율 시 마진율을 복잡한 계산 없이 한눈에 확인할 수 있는 ‘구글 스프레드시트 템플릿’ 사본을 보너스로 증정합니다.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Form Section */}
        <section className="form-section" id="apply-form">
          <div className="form-wrapper">
            <div className="form-card">
              {!isSubmitted ? (
                <form onSubmit={handleFormSubmit} id="marketing-lead-form">
                  <h2 className="form-card-title">무료 치트시트 신청하기</h2>
                  <p className="form-card-desc">
                    정보를 입력하시면 7단계 체크리스트와 마진율 계산기를 즉시 다운로드할 수 있습니다.
                  </p>

                  {errorMsg && (
                    <div style={{ color: '#d93025', backgroundColor: '#fce8e6', padding: '0.8rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.9rem', fontWeight: 600 }}>
                      ⚠️ {errorMsg}
                    </div>
                  )}

                  <div className="input-group">
                    <label className="input-label" htmlFor="lead-name">대표자 성함 *</label>
                    <input
                      type="text"
                      id="lead-name"
                      className="input-field"
                      placeholder="홍길동"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="lead-email">이메일 주소 *</label>
                    <input
                      type="email"
                      id="lead-email"
                      className="input-field"
                      placeholder="owner@cafe.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="lead-cafe-name">운영 중이신 카페명 *</label>
                    <input
                      type="text"
                      id="lead-cafe-name"
                      className="input-field"
                      placeholder="카페 에이 성수점"
                      value={cafeName}
                      onChange={(e) => setCafeName(e.target.value)}
                      disabled={isSubmitting}
                      required
                    />
                  </div>

                  <div className="input-group">
                    <label className="input-label" htmlFor="lead-phone">휴대폰 번호 (선택)</label>
                    <input
                      type="tel"
                      id="lead-phone"
                      className="input-field"
                      placeholder="010-1234-5678"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={isSubmitting}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="submit-btn" 
                    id="submit-form-btn"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? '가이드북 및 계산기 준비 중...' : '무료 치트시트 & 마진 계산기 즉시 받기'}
                  </button>

                  <p className="form-footer-note">
                    * 입력하신 소중한 정보는 가이드북 전송 및 카페 마케팅 유용한 정보 발송 외에 절대 사용되지 않습니다.
                  </p>
                </form>
              ) : (
                <div className="success-card">
                  <div className="success-icon">🎉</div>
                  <h2 className="success-title">다운로드 준비 완료!</h2>
                  <p className="success-desc">
                    {name} 사장님, 아래 다운로드 버튼을 눌러 즉시 7단계 체크리스트 마크다운 파일(.md)을 다운로드 받으세요.<br />
                    구글 스프레드시트 마진 계산기 링크도 함께 제공됩니다.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={handleDownloadChecklist} className="download-link" style={{ border: 'none', cursor: 'pointer', fontSize: '1rem', width: '100%', maxWidth: '350px' }}>
                      📋 7단계 체크리스트 다운로드 (.md)
                    </button>
                    
                    <a 
                      href="https://docs.google.com/spreadsheets/d/1_yZ8_sJ5qfP_0nI0_JbQJ_Mszw5cRzQj6f_lT2R3U4I/copy" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="download-link"
                      style={{ backgroundColor: '#107c41', width: '100%', maxWidth: '350px' }}
                    >
                      📊 마진율 계산기 스프레드시트 복사 (Google)
                    </a>
                  </div>

                  <p className="form-footer-note" style={{ marginTop: '2rem' }}>
                    체크리스트를 통해 네이버 플레이스 노출을 극대화하고, 단골 손님이 가득한 하루를 만들어 보세요.
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="container footer-flex">
          <div className="logo" style={{ color: '#8c7667', fontSize: '1.2rem' }}>
            <span>☕</span> 플레이스 마케팅
          </div>
          <div className="footer-text">
            © 2026 AZIT ART COMPANY. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
};

export default CafeMarketingPage;
