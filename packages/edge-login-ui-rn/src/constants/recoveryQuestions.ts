import { EdgeRecoveryQuestionChoice } from 'edge-core-js'

import s from '../common/locales/strings'

export const questionsList: EdgeRecoveryQuestionChoice[] = [
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question1
  },
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question2
  },
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question3
  },
  {
    min_length: 8,
    category: 'must',
    question: s.strings.change_recovery_question4
  },
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question5
  },
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question6
  },
  {
    min_length: 10,
    category: 'address',
    question: s.strings.change_recovery_question7
  },
  {
    min_length: 10,
    category: 'address',
    question: s.strings.change_recovery_question8
  },
  {
    min_length: 8,
    category: 'string',
    question: s.strings.change_recovery_question9
  },
  {
    min_length: 8,
    category: 'string',
    question: s.strings.change_recovery_question10
  },
  {
    min_length: 10,
    category: 'numeric',
    question: s.strings.change_recovery_question11
  },
  {
    min_length: 10,
    category: 'string',
    question: s.strings.change_recovery_question12
  },
  {
    min_length: 8,
    category: 'must',
    question: s.strings.change_recovery_question13
  }
]
