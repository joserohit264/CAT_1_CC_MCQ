import React, { useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpenCheck,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Moon,
  RotateCcw,
  Sun,
  Trophy,
  X,
} from 'lucide-react';
import { sections } from './quizData';
import './styles.css';

const LETTERS = ['A', 'B', 'C', 'D'];

function App() {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dsa-practice-theme') || 'dark';
    } catch {
      return 'dark';
    }
  });
  const [activeSection, setActiveSection] = useState(0);
  const [responses, setResponses] = useState(() => sections.map(() => ({})));
  const [submitted, setSubmitted] = useState(() => sections.map(() => false));
  const [scores, setScores] = useState(() => sections.map(() => null));
  const [notice, setNotice] = useState('');

  const section = sections[activeSection];
  const currentResponses = responses[activeSection];
  const isSubmitted = submitted[activeSection];
  const answeredCount = Object.keys(currentResponses).length;
  const sectionScore = scores[activeSection];
  const completedCount = submitted.filter(Boolean).length;
  const attemptedQuestions = completedCount * 10;
  const earnedPoints = scores.reduce((total, score) => total + (score ?? 0), 0);
  const allComplete = completedCount === sections.length;
  const overallPercent = attemptedQuestions ? Math.round((earnedPoints / attemptedQuestions) * 100) : 0;

  const sectionStates = useMemo(() => sections.map((_, index) => {
    const count = Object.keys(responses[index]).length;
    return submitted[index] ? 'complete' : count ? 'started' : 'empty';
  }), [responses, submitted]);

  function changeTheme() {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    try {
      localStorage.setItem('dsa-practice-theme', nextTheme);
    } catch {
      // Theme still changes for the current session when storage is unavailable.
    }
  }

  function chooseAnswer(questionIndex, optionIndex) {
    if (isSubmitted) return;
    setResponses((previous) => {
      const copy = [...previous];
      copy[activeSection] = { ...copy[activeSection], [questionIndex]: optionIndex };
      return copy;
    });
    setNotice('');
  }

  function submitSection() {
    if (answeredCount !== 10) {
      setNotice(`Please answer all 10 questions before submitting. You have answered ${answeredCount} of 10.`);
      return;
    }
    const score = section.questions.reduce((total, question, index) => (
      total + (currentResponses[index] === question.answer ? 1 : 0)
    ), 0);
    setScores((previous) => {
      const copy = [...previous];
      copy[activeSection] = score;
      return copy;
    });
    setSubmitted((previous) => {
      const copy = [...previous];
      copy[activeSection] = true;
      return copy;
    });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function retrySection() {
    setResponses((previous) => {
      const copy = [...previous];
      copy[activeSection] = {};
      return copy;
    });
    setSubmitted((previous) => {
      const copy = [...previous];
      copy[activeSection] = false;
      return copy;
    });
    setScores((previous) => {
      const copy = [...previous];
      copy[activeSection] = null;
      return copy;
    });
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function retryAll() {
    const confirmed = window.confirm('Restart the entire 140-question quiz? All answers and section scores will be cleared.');
    if (!confirmed) return;
    setResponses(sections.map(() => ({})));
    setSubmitted(sections.map(() => false));
    setScores(sections.map(() => null));
    setActiveSection(0);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goToSection(index) {
    setActiveSection(index);
    setNotice('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goNext() {
    if (activeSection < sections.length - 1) goToSection(activeSection + 1);
  }

  function goPrevious() {
    if (activeSection > 0) goToSection(activeSection - 1);
  }

  return (
    <div className={`app theme-${theme}`}>
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="DSA Practice Lab home">
          <span className="brand-mark"><BookOpenCheck size={20} strokeWidth={2.2} /></span>
          <span className="brand-copy">
            <strong>DSA Practice Lab</strong>
            <small>PREPARE · PRACTICE · IMPROVE</small>
          </span>
        </a>
        <div className="top-actions">
          <div className="top-stat"><span className="stat-dot" /> 140 MCQs <span className="stat-divider">/</span> 14 sections</div>
          <button className="icon-button theme-toggle" onClick={changeTheme} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`} title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button className="reset-top" onClick={retryAll}><RotateCcw size={15} /> <span>Restart quiz</span></button>
        </div>
      </header>

      <main id="top" className="page-shell">
        <section className="intro-row">
          <div>
            <div className="eyebrow"><span className="eyebrow-line" /> YOUR DSA REVISION WORKSPACE</div>
            <h1>Test what you <span>know.</span></h1>
            <p className="intro-copy">Work through 14 focused sections. Submit each set to check your answers, see the correct options, and track your score.</p>
          </div>
          <div className="overall-card">
            <div className="overall-topline"><span>OVERALL PROGRESS</span><span>{completedCount} / 14 completed</span></div>
            <div className="overall-track"><div className="overall-fill" style={{ width: `${(completedCount / 14) * 100}%` }} /></div>
            <div className="overall-bottom">
              <div><strong>{attemptedQuestions ? `${earnedPoints}/${attemptedQuestions}` : '—'}</strong><span>points earned</span></div>
              <div className="overall-percent">{attemptedQuestions ? `${overallPercent}%` : '0%'}<span>accuracy</span></div>
            </div>
          </div>
        </section>

        <div className="workspace">
          <aside className="section-rail">
            <div className="rail-heading"><span>YOUR SECTIONS</span><span className="rail-count">14</span></div>
            <div className="section-list">
              {sections.map((item, index) => {
                const status = sectionStates[index];
                const active = activeSection === index;
                return (
                  <button
                    key={item.shortTitle + index}
                    className={`section-tab ${active ? 'active' : ''} ${status}`}
                    onClick={() => goToSection(index)}
                    aria-current={active ? 'step' : undefined}
                  >
                    <span className="section-number">
                      {status === 'complete' ? <Check size={14} /> : String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="section-tab-copy">
                      <strong>{item.shortTitle}</strong>
                      <small>{status === 'complete' ? `Scored ${scores[index]}/10` : status === 'started' ? `${Object.keys(responses[index]).length}/10 answered` : '10 questions'}</small>
                    </span>
                    {active && <span className="active-indicator" />}
                  </button>
                );
              })}
            </div>
            <div className="rail-tip">
              <div className="tip-icon"><Award size={17} /></div>
              <div><strong>One section at a time</strong><p>Submit a section to reveal your score and correct answers.</p></div>
            </div>
          </aside>

          <section className="quiz-panel">
            <div className="section-heading">
              <div className="section-heading-main">
                <div className="section-kicker">SECTION {String(activeSection + 1).padStart(2, '0')} <span>·</span> 10 QUESTIONS</div>
                <h2>{section.title}</h2>
                <p>{section.subtitle}</p>
              </div>
              <div className="section-score-pill">
                {isSubmitted ? <><CheckCircle2 size={16} /><span>{sectionScore}/10</span></> : <><ClipboardCheck size={16} /><span>{answeredCount}/10</span></>}
              </div>
            </div>

            <div className="question-progress-row">
              <span>{isSubmitted ? 'SECTION SUBMITTED' : 'ANSWER PROGRESS'}</span>
              <strong>{answeredCount} <small>/ 10 answered</small></strong>
            </div>
            <div className="question-progress-track"><div className={`question-progress-fill ${isSubmitted ? 'submitted' : ''}`} style={{ width: `${(answeredCount / 10) * 100}%` }} /></div>

            <div className="question-nav-strip" aria-label="Question Navigation">
              <span className="q-nav-label">Questions:</span>
              <div className="q-nav-buttons">
                {section.questions.map((_, qIdx) => {
                  const isAnswered = currentResponses[qIdx] !== undefined;
                  const isCorrect = isSubmitted && currentResponses[qIdx] === section.questions[qIdx].answer;
                  const isWrong = isSubmitted && currentResponses[qIdx] !== section.questions[qIdx].answer;
                  let statusClass = '';
                  if (isCorrect) statusClass = 'q-correct';
                  else if (isWrong) statusClass = 'q-wrong';
                  else if (isAnswered) statusClass = 'q-answered';

                  return (
                    <button
                      key={qIdx}
                      type="button"
                      className={`q-nav-btn ${statusClass}`}
                      onClick={() => {
                        const target = document.getElementById(`q-${qIdx}`);
                        if (target) {
                          target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                      }}
                      title={`Jump to Question ${qIdx + 1}${isAnswered ? ' (Answered)' : ''}`}
                    >
                      {qIdx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {isSubmitted && (
              <div className={`result-banner ${sectionScore >= 7 ? 'result-good' : sectionScore >= 5 ? 'result-mid' : 'result-low'}`}>
                <div className="result-symbol">{sectionScore >= 7 ? <Trophy size={22} /> : <ClipboardCheck size={22} />}</div>
                <div className="result-message">
                  <strong>{sectionScore === 10 ? 'Perfect score!' : sectionScore >= 7 ? 'Great work!' : sectionScore >= 5 ? 'Good effort — keep practising.' : 'Keep going — practice makes progress.'}</strong>
                  <span>You got {sectionScore} out of 10 correct ({sectionScore * 10}%). Correct answers are highlighted below.</span>
                </div>
                <div className="result-score"><strong>{sectionScore}<small>/10</small></strong><span>SCORE</span></div>
              </div>
            )}

            <div className="questions-list">
              {section.questions.map((question, questionIndex) => {
                const selected = currentResponses[questionIndex];
                const isCorrect = isSubmitted && selected === question.answer;
                const isWrong = isSubmitted && selected !== question.answer;
                return (
                  <article
                    id={`q-${questionIndex}`}
                    style={{ scrollMarginTop: '96px' }}
                    className={`question-card ${isSubmitted ? (isCorrect ? 'question-correct' : 'question-wrong') : ''}`}
                    key={`${activeSection}-${questionIndex}`}
                  >
                    <div className="question-topline">
                      <span className="question-index">Q{String(questionIndex + 1).padStart(2, '0')}</span>
                      {isSubmitted && (
                        <span className={`answer-status ${isCorrect ? 'status-correct' : 'status-wrong'}`}>
                          {isCorrect ? <><CheckCircle2 size={14} /> Correct</> : <><X size={14} /> Incorrect</>}
                        </span>
                      )}
                    </div>
                    <h3>{question.q}</h3>
                    <div className="options-grid" role="radiogroup" aria-label={`Question ${questionIndex + 1} options`}>
                      {question.options.map((option, optionIndex) => {
                        const chosen = selected === optionIndex;
                        const correctOption = question.answer === optionIndex;
                        let optionClass = '';
                        if (!isSubmitted && chosen) optionClass = 'option-selected';
                        if (isSubmitted && correctOption) optionClass = 'option-correct';
                        else if (isSubmitted && chosen && !correctOption) optionClass = 'option-incorrect';
                        return (
                          <button
                            type="button"
                            key={optionIndex}
                            className={`option ${optionClass}`}
                            role="radio"
                            aria-checked={chosen}
                            disabled={isSubmitted}
                            onClick={() => chooseAnswer(questionIndex, optionIndex)}
                          >
                            <span className="option-letter">{LETTERS[optionIndex]}</span>
                            <span className="option-text">{option}</span>
                            {isSubmitted && correctOption && <CheckCircle2 className="option-end-icon" size={17} />}
                            {isSubmitted && chosen && !correctOption && <X className="option-end-icon" size={17} />}
                            {!isSubmitted && chosen && <span className="selected-dot" />}
                          </button>
                        );
                      })}
                    </div>
                    {isSubmitted && isWrong && (
                      <div className="correct-answer-note"><CheckCircle2 size={15} /><span>Correct answer: <strong>{LETTERS[question.answer]}. {question.options[question.answer]}</strong></span></div>
                    )}
                  </article>
                );
              })}
            </div>

            {notice && <div className="notice-message" role="alert">{notice}</div>}

            <div className="quiz-footer">
              <button className="secondary-button" onClick={goPrevious} disabled={activeSection === 0}>
                <ArrowLeft size={16} /> Previous
              </button>
              <div className="footer-actions">
                {isSubmitted ? (
                  <button className="secondary-button retry-button" onClick={retrySection}><RotateCcw size={15} /> Retry section</button>
                ) : (
                  <button className="secondary-button retry-button" onClick={retrySection} disabled={answeredCount === 0}><RotateCcw size={15} /> Clear section</button>
                )}
                {!isSubmitted ? (
                  <button className="primary-button" onClick={submitSection}>
                    Submit answers <ArrowRight size={17} />
                  </button>
                ) : activeSection < sections.length - 1 ? (
                  <button className="primary-button" onClick={goNext}>Next section <ArrowRight size={17} /></button>
                ) : (
                  <button className="primary-button" onClick={retryAll}><RotateCcw size={16} /> Retry entire quiz</button>
                )}
              </div>
            </div>

            {allComplete && (
              <div className="completion-card">
                <div className="completion-icon"><Trophy size={23} /></div>
                <div><strong>You completed all 14 sections!</strong><p>Your final score is {earnedPoints} out of 140 ({Math.round((earnedPoints / 140) * 100)}%). Retry the full quiz to practise again.</p></div>
              </div>
            )}
          </section>
        </div>

        <footer className="page-footer">
          <span>DSA PRACTICE LAB</span>
          <span>14 sections <i /> 140 questions <i /> Instant answer review</span>
        </footer>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);
