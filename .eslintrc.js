// https://eslint.org/docs/user-guide/configuring

module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint'
    },
    env: {
      browser: true,
    },
    extends: [
      // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
      // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
      'plugin:vue/essential',
      // https://github.com/standard/standard/blob/master/docs/RULES-en.md
      'standard'
    ],
    // required to lint *.vue files
    plugins: [
      'vue'
    ],
    // add your custom rules here
    rules: {
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      //
      // ���ܵĴ���
      // ��Щ������ JavaScript �����п��ܵ��﷨������߼������й�
      //
      // ��ֹ for ѭ�����ַ�������ѭ�������� for (i = 0; i < 10; i--)
      'for-direction': 'error',
      // getter �����з���ֵ�����ҽ�ֹ���ؿգ����� return;
      'getter-return': [
        'error',
        {
          allowImplicit: false
        }
      ],
      // ��ֹ�� await д��ѭ�����Ϊ�������޷�ͬʱ���Ͷ���첽������
      // @off Ҫ��̫�ϸ��ˣ���ʱ��Ҫ��ѭ����д await
      'no-await-in-loop': 'off',
      // ��ֹ�븺����бȽ�
      'no-compare-neg-zero': 'error',
      // ��ֹ�ڲ��Ա��ʽ��ʹ�ø�ֵ��䣬���������ֵ��䱻���Ű�������
      'no-cond-assign': [
        'error',
        'except-parens'
      ],
      // ��ֹʹ�� console
      // @off console ��ʹ�úܳ���
      'no-console': 'off',
      // ��ֹ��������Ϊ��֧�����ж��еĲ��Ա��ʽ����������Ϊѭ�������ж��еĲ��Ա��ʽ
      'no-constant-condition': [
        'error',
        {
          checkLoops: false
        }
      ],
      // ��ֹ��������ʽ�г��� Ctrl ���� ASCII ��ʾ������ֹʹ�� /\x1f/
      // @off ���������������ֳ���
      'no-control-regex': 'error',
      // ��ֹ�ں��������г����ظ����ƵĲ���
      'no-dupe-args': 'error',
      // ��ֹ�ڶ����������г����ظ����Ƶļ���
      'no-dupe-keys': 'error',
      // ��ֹ�� switch ����г����ظ����Ա��ʽ�� case
      'no-duplicate-case': 'error',
      // ��ֹ���ֿմ����
      'no-empty': [
        'error',
        {
          allowEmptyCatch: true
        }
      ],
      // ��ֹ��������ʽ��ʹ�ÿյ��ַ��� []
      'no-empty-character-class': 'error',
      // ��ֹ�� catch �ĵ�һ������ error ���¸�ֵ
      'no-ex-assign': 'error',
      // @fixable ��ֹ�ڲ��Ա��ʽ��ʹ�� !! �� Boolean
      'no-extra-boolean-cast': 'error',
      // @fixable ��ֹ�������ʽ�г��ֶ�������ţ����� let foo = (function () { return 1 })
      'no-extra-parens': [
        'error',
        'functions'
      ],
      // @fixable ��ֹ���ֶ���ķֺ�
      'no-extra-semi': 'error',
      // ��ֹ��һ�������������¸�ֵ���磺
      // function foo() {}
      // foo = bar
      'no-func-assign': 'error',
      // ��ֹ�� if ������ڳ��ֺ�������
      'no-inner-declarations': [
        'error',
        'both'
      ],
      // ��ֹ�� RegExp ���캯���г��ַǷ���������ʽ
      'no-invalid-regexp': 'error',
      // ��ֹʹ������հ׷�������ȫ�ǿո񣩣������ǳ������ַ�����������ʽ��ģ���ַ�����
      'no-irregular-whitespace': [
        'error',
        {
          skipStrings: true,
          skipComments: false,
          skipRegExps: true,
          skipTemplates: true
        }
      ],
      // ��ֹ�� Math, JSON �� Reflect ֱ����Ϊ��������
      'no-obj-calls': 'error',
      // ��ֹʹ�� hasOwnProperty, isPrototypeOf �� propertyIsEnumerable
      // @off hasOwnProperty �Ƚϳ���
      'no-prototype-builtins': 'off',
      // @fixable ��ֹ��������ʽ�г��������Ŀո񣬱���ʹ�� /foo {3}bar/ ����
      'no-regex-spaces': 'error',
      // ��ֹ�������г��������Ķ��ţ��� let foo = [,,]
      'no-sparse-arrays': 'error',
      // ��ֹ����ͨ�ַ����г��� es2015 ��ģ���ַ����ı�����ʽ���� 'Hello ${name}!'
      'no-template-curly-in-string': 'error',
      // ��ֹ�����������Ķ��б��ʽ���磺
      // let foo = bar
      // [1, 2, 3].forEach(baz);
      'no-unexpected-multiline': 'error',
      // ��ֹ�� return, throw, break �� continue ֮���д���
      'no-unreachable': 'error',
      // ��ֹ�� finally �г��� return, throw, break �� continue
      'no-unsafe-finally': 'error',
      // @fixable ��ֹ�� in �� instanceof �����������ʹ�ø�̾�ţ��� if (!key in object)
      'no-unsafe-negation': 'error',
      // ����ʹ�� isNaN(foo) ������ foo === NaN
      'use-isnan': 'error',
      // ע�ͱ������ jsdoc �Ĺ淶
      // @off jsdoc Ҫ��̫�ϸ�
      'valid-jsdoc': 'off',
      // typeof ���ʽ�ȽϵĶ�������� 'undefined', 'object', 'boolean', 'number', 'string', 'function' �� 'symbol'
      'valid-typeof': 'error',
  
  
  
      //
      //
      // ���ʵ��
      // ��Щ����ͨ��һЩ���ʵ���������������
      //
      // setter �����ж�Ӧ�� getter��getter ����û�ж�Ӧ�� setter
      'accessor-pairs': [
        'error',
        {
          setWithoutGet: true,
          getWithoutSet: false
        }
      ],
      // ����ķ������� forEach ֮�⣬�ص����������з���ֵ
      'array-callback-return': 'error',
      // �� var ����ı�����Ϊ�������򣬽�ֹ�ڿ���ʹ��
      'block-scoped-var': 'error',
      // ����ķǾ�̬�����У�������ڶ� this ������
      // @off ̫�ϸ���
      'class-methods-use-this': 'off',
      // ��ֹ������ѭ�����Ӷȳ��� 20��https://en.wikipedia.org/wiki/Cyclomatic_complexity
      'complexity': [
        'error',
        {
          max: 20
        }
      ],
      // ��ֹ�����ڲ�ͬ��֧���ز�ͬ���͵�ֵ
      // @off ̫�ϸ���
      'consistent-return': 'off',
      // @fixable if �������Ҫ�� {�������ǵ��� if
      'curly': [
        'error',
        'multi-line',
        'consistent'
      ],
      // switch �������� default
      // @off ̫�ϸ���
      'default-case': 'off',
      // @fixable ��ʽ���õ�ʱ�򣬵�ű�����ڵڶ��п�ͷ������ֹ���ڵ�һ�н�β��
      'dot-location': [
        'error',
        'property'
      ],
      // @fixable ��ֹ���� foo['bar']������д�� foo.bar
      // @off ����Ҫдһϵ�����Ե�ʱ�򣬿��Ը�ͳһ
      'dot-notation': 'off',
      // @fixable ����ʹ�� === �� !==����ֹʹ�� == �� !=���� null �Ƚ�ʱ����
      'eqeqeq': [
        'error',
        'always',
        {
          null: 'ignore'
        }
      ],
      // for in �ڲ������� hasOwnProperty
      'guard-for-in': 'error',
      // ��ֹʹ�� alert
      // @off alert �ܳ���
      'no-alert': 'off',
      // ��ֹʹ�� caller �� callee
      'no-caller': 'error',
      // switch �� case ���б��������ʱ�򣬱���ʹ�ô����Ž� case �ڱ��һ�������
      'no-case-declarations': 'error',
      // ��ֹ��������ʽ�г������Ƴ����������Ŀ�ͷ���� let a = /=foo/
      // @off �д�������Ļ������Ķ����ִ���ʱ��Ҳ��ȫ����������������ϵ�����
      'no-div-regex': 'off',
      // @fixable ��ֹ�� else ��ʹ�� return�������Ϊ��ǰ����
      // @off else ��ʹ�� return ����ʹ����ṹ������
      'no-else-return': 'off',
      // �������пպ����������ǽ�һ���պ�������Ϊĳ�����Ĭ��ֵ
      'no-empty-function': [
        'error',
        {
          allow: [
            'functions',
            'arrowFunctions'
          ]
        }
      ],
      // ��ֹ�⹹�г��ֿ� {} �� []
      'no-empty-pattern': 'error',
      // ��ֹʹ�� foo == null �� foo != null������ʹ�� foo === null �� foo !== null
      // @off foo == null �����ж� foo ���� undefined ���Ҳ��� null���Ƚϳ��ã��������д��
      'no-eq-null': 'off',
      // ��ֹʹ�� eval
      'no-eval': 'error',
      // ��ֹ�޸�ԭ������
      'no-extend-native': 'error',
      // @fixable ��ֹ����û��Ҫ�� bind
      'no-extra-bind': 'error',
      // @fixable ��ֹ����û��Ҫ�� label
      'no-extra-label': 'error',
      // switch �� case �ڱ����� break, return �� throw
      'no-fallthrough': 'error',
      // @fixable ��ʾС��ʱ����ֹʡ�� 0������ .5
      'no-floating-decimal': 'error',
      // ��ֹ��ȫ�ֱ�����ֵ
      'no-global-assign': 'error',
      // @fixable ��ֹʹ�� !! ~ ���������������
      // ������ʹ�� !!
      'no-implicit-coercion': [
        'error',
        {
          allow: [
            '!!'
          ]
        }
      ],
      // ��ֹ��ȫ���������¶����������������
      'no-implicit-globals': 'error',
      // ��ֹ�� setTimeout �� setInterval �д����ַ������� setTimeout('alert("Hi!")', 100);
      'no-implied-eval': 'error',
      // ��ֹ����֮��ĵط�ʹ�� this
      // @off this ��ʹ�ú����¼��ص��п��Ա�ʾ��ǰԪ�أ�����Ҳ�������� this�����Ժ󱻵��õ�ʱ���� call
      'no-invalid-this': 'off',
      // ��ֹʹ�� __iterator__
      'no-iterator': 'error',
      // ��ֹʹ�� label
      'no-labels': 'error',
      // ��ֹʹ��û��Ҫ�� {} ��Ϊ�����
      'no-lone-blocks': 'error',
      // ��ֹ��ѭ���ڵĺ����г���ѭ������������ж���ı��������磺
      // for (var i = 0; i < 10; i++) {
      //     (function () { return i })();
      // }
      'no-loop-func': 'error',
      // ��ֹʹ�� magic numbers
      // @off ̫�ϸ���
      'no-magic-numbers': 'off',
      // @fixable ��ֹ���������Ķ���ո񣬳�����ע��ǰ��������������ԡ��������塢import ��
      'no-multi-spaces': [
        'error',
        {
          ignoreEOLComments: true,
          exceptions: {
            Property: true,
            BinaryExpression: false,
            VariableDeclarator: true,
            ImportDeclaration: true
          }
        }
      ],
      // ��ֹʹ�� \ �������ַ���
      'no-multi-str': 'error',
      // ��ֱֹ�� new һ���������ֵ
      'no-new': 'error',
      // ��ֹʹ�� new Function������ let x = new Function("a", "b", "return a + b");
      'no-new-func': 'error',
      // ��ֹʹ�� new ������ String, Number �� Boolean
      'no-new-wrappers': 'error',
      // ��ֹʹ�� 0 ��ͷ�����ֱ�ʾ�˽�����
      'no-octal': 'error',
      // ��ֹʹ�ð˽��Ƶ�ת���
      'no-octal-escape': 'error',
      // ��ֹ�Ժ����Ĳ������¸�ֵ
      'no-param-reassign': 'error',
      // ��ֹʹ�� __proto__
      'no-proto': 'error',
      // ��ֹ�ظ��������
      'no-redeclare': 'error',
      // ��ֹʹ��ָ���Ķ�������
      // @off ����������ĳ������� api ����ʹ��
      'no-restricted-properties': 'off',
      // ��ֹ�� return ����︳ֵ
      'no-return-assign': [
        'error',
        'always'
      ],
      // ��ֹ�� return �����ʹ�� await
      'no-return-await': 'error',
      // ��ֹ���� location.href = 'javascript:void(0)';
      'no-script-url': 'error',
      // ��ֹ���Լ���ֵ���Լ�
      'no-self-assign': 'error',
      // ��ֹ���Լ����Լ��Ƚ�
      'no-self-compare': 'error',
      // ��ֹʹ�ö��Ų�����
      'no-sequences': 'error',
      // ��ֹ throw ������������ throw һ�� Error ����
      'no-throw-literal': 'error',
      // ѭ���ڱ����ѭ�������ı������޸�
      'no-unmodified-loop-condition': 'error',
      // ��ֹ���õı��ʽ
      'no-unused-expressions': [
        'error',
        {
          allowShortCircuit: true,
          allowTernary: true,
          allowTaggedTemplates: true
        }
      ],
      // @fixable ��ֹ����û�õ� label
      'no-unused-labels': 'error',
      // ��ֹ����û��Ҫ�� call �� apply
      'no-useless-call': 'error',
      // ��ֹ����û��Ҫ���ַ�������
      'no-useless-concat': 'error',
      // ��ֹ����û��Ҫ��ת��
      // @off ת�����ʹ������׶�
      'no-useless-escape': 'off',
      // @fixable ��ֹû��Ҫ�� return
      // @off û��Ҫ���� return
      'no-useless-return': 'off',
      // ��ֹʹ�� void
      'no-void': 'error',
      // ��ֹע���г��� TODO �� FIXME
      // @off TODO �ܳ���
      'no-warning-comments': 'off',
      // ��ֹʹ�� with
      'no-with': 'error',
      // Promise �� reject �б��봫�� Error ���󣬶�����������
      'prefer-promise-reject-errors': 'error',
      // parseInt ���봫��ڶ�������
      'radix': 'error',
      // async �����б������ await ���
      // @off async function ��û�� await ��д���ܳ��������� koa ��ʾ���о��������÷�
      'require-await': 'off',
      // var ���������������ǰ��
      // @off var ������ǰ��Ҳ�Ǻܳ������÷�
      'vars-on-top': 'off',
      // @fixable ����ִ�еĺ�������������¸�ʽ (function () { alert('Hello') })()
      'wrap-iife': [
        'error',
        'inside',
        {
          functionPrototypeMethods: true
        }
      ],
      // @fixable ����ʹ�� if (foo === 5) ������ if (5 === foo)
      'yoda': [
        'error',
        'never',
        {
          onlyEquality: true
        }
      ],
  
  
  
      //
      //
      // �ϸ�ģʽ
      // ��Щ�������ϸ�ģʽָ���й�
      //
      // @fixable ��ֹʹ�� 'strict';
      'strict': [
        'error',
        'never'
      ],
  
  
  
      //
      //
      // ����
      // ��Щ��������������й�
      //
      // ���������ڶ����ʱ��ֵ
      // @off �ȶ����ֵ�ܳ���
      'init-declarations': 'off',
      // ��ֹ catch �Ĳ������붨����ı����ظ�
      // @off ̫�ϸ���
      'no-catch-shadow': 'off',
      // ��ֹʹ�� delete
      'no-delete-var': 'error',
      // ��ֹ label �����붨����ı����ظ�
      'no-label-var': 'error',
      // ��ֹʹ��ָ����ȫ�ֱ���
      // @off ����������ĳ������ı���������ʹ��
      'no-restricted-globals': 'off',
      // ��ֹ���������ϲ��������ڵĶ�����ı����ظ�
      // @off �ܶ�ʱ�������βκʹ�����ͬ����
      'no-shadow': 'off',
      // ��ֹʹ�ñ�������Ϊ������
      'no-shadow-restricted-names': 'error',
      // ��ֹʹ��δ����ı���
      'no-undef': [
        'error',
        {
          typeof: false
        }
      ],
      // @fixable ��ֹ�� undefined ��ֵ������
      'no-undef-init': 'error',
      // ��ֹ�� undefined ���¸�ֵ
      'no-undefined': 'error',
      // ������ı�������ʹ��
      'no-unused-vars': [
        'error',
        {
          vars: 'all',
          args: 'none',
          caughtErrors: 'none',
          ignoreRestSiblings: true
        }
      ],
      // ���������ȶ����ʹ��
      'no-use-before-define': [
        'error',
        {
          functions: false,
          classes: false,
          variables: false
        }
      ],
  
  
  
      //
      //
      // Node.js �� CommonJS
      // ��Щ�������� Node.js �����еĴ�����������ʹ�õ� CommonJS �й�
      //
      // callback ֮��������� return
      // @off Limitations ̫����
      'callback-return': 'off',
      // require ������ȫ����������
      // @off �������غܳ���
      'global-require': 'off',
      // callback �е� error ���뱻����
      'handle-callback-err': 'error',
      // ��ֱֹ��ʹ�� Buffer
      'no-buffer-constructor': 'error',
      // ��ͬ���͵� require �������һ��
      // @off ̫�ϸ���
      'no-mixed-requires': 'off',
      // ��ֱֹ�� new require('foo')
      'no-new-require': 'error',
      // ��ֹ�� __dirname �� __filename ʹ���ַ�������
      'no-path-concat': 'error',
      // ��ֹʹ�� process.env.NODE_ENV
      // @off ʹ�úܳ���
      'no-process-env': 'off',
      // ��ֹʹ�� process.exit(0)
      // @off ʹ�úܳ���
      'no-process-exit': 'off',
      // ��ֹʹ��ָ����ģ��
      // @off ����������ĳ�������ģ�鲻��ʹ��
      'no-restricted-modules': 'off',
      // ��ֹʹ�� node �е�ͬ���ķ��������� fs.readFileSync
      // @off ʹ�úܳ���
      'no-sync': 'off',
  
  
  
      //
      //
      // �������
      // ��Щ������������йأ������Ƿǳ����۵�
      //
      // @fixable �����������������ǰ��Ļ��и�ʽ
      // @off �������޷����Ƴ���Ҫ������
      'array-bracket-newline': 'off',
      // @fixable ����������ڵ�ǰ���ֹ�пո�
      'array-bracket-spacing': [
        'error',
        'never'
      ],
      // @fixable ���������Ԫ��֮��Ļ��и�ʽ
      // @off ����һ�а������Ԫ�أ�������������������д
      'array-element-newline': 'off',
      // @fixable ����������һ���ڣ���ô�������ڵ���β�����пո񣬱��� function () { alert('Hello') }
      'block-spacing': [
        'error',
        'always'
      ],
      // @fixable if �� else �Ĵ����ŷ�����һ��
      // @off else ��������ǰ����Ҫ��һ��ע��
      'brace-style': 'off',
      // ������������ camelcase ����
      // @off �ܶ� api ���ļ��������� camelcase
      'camelcase': 'off',
      // @fixable ע�͵�����ĸ�����д
      // @off û��Ҫ����
      'capitalized-comments': 'off',
      // @fixable ��������һ������ĩβ�����ж���
      // @off û��Ҫ����
      'comma-dangle': 'off',
      // @fixable ����ǰ��ֹ�пո񣬶��ź����Ҫ�пո�
      'comma-spacing': [
        'error',
        {
          'before': false,
          'after': true
        }
      ],
      // @fixable ��ֹ������д����
      'comma-style': [
        'error',
        'last'
      ],
      // @fixable ��������ļ�������ʱ���������ڵ���β��ֹ�пո�
      'computed-property-spacing': [
        'error',
        'never'
      ],
      // ���� this �ı���
      // @off û��Ҫ����
      'consistent-this': 'off',
      // @fixable �ļ����һ�б�����һ������
      // @off û��Ҫ����
      'eol-last': 'off',
      // @fixable ��������ִ����������֮���ֹ�пո�
      'func-call-spacing': [
        'error',
        'never'
      ],
      // ������ֵ��������ʱ�򣬺����������������һ��
      'func-name-matching': [
        'error',
        'always',
        {
          includeCommonJSModuleExports: false
        }
      ],
      // ��������������
      // @off û��Ҫ����
      'func-names': 'off',
      // ����ֻʹ�ú���������ֻʹ�ú������ʽ
      // @off û��Ҫ����
      'func-style': 'off',
      // ��ֹʹ��ָ���ı�ʶ��
      // @off ����������ĳ������ı�ʶ������ʹ��
      'id-blacklist': 'off',
      // ���Ʊ���������
      // @off û��Ҫ���Ʊ���������
      'id-length': 'off',
      // ���Ʊ���������ƥ��ָ����������ʽ
      // @off û��Ҫ���Ʊ�����
      'id-match': 'off',
      // @fixable һ������������2���ո����
      'indent': [
        'error',
        4,
        {
          SwitchCase: 1,
          flatTernaryExpressions: true
        }
      ],
      // @fixable jsx �е����Ա�����˫����
      'jsx-quotes': [
        'error',
        'prefer-double'
      ],
      // @fixable ������������ð��ǰ���ֹ�пո񣬺�������пո�
      'key-spacing': [
        'error',
        {
          beforeColon: false,
          afterColon: true,
          mode: 'strict',
        }
      ],
      // @fixable �ؼ���ǰ������пո�
      'keyword-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],
      // ����ע�ͱ���д����һ��
      // @off û��Ҫ����
      'line-comment-position': 'off',
      // @fixable ���ƻ��з�Ϊ LF �� CRLF
      // @off û��Ҫ����
      'linebreak-style': 'off',
      // @fixable ע��ǰ������п���
      // @off û��Ҫ����
      'lines-around-comment': 'off',
      // �����Ƕ�׵���Ƚ�ֹ���� 5 ��
      'max-depth': [
        'error',
        5
      ],
      // ����һ�еĳ���
      // @off ���ڱ༭���Ѿ��������ˣ�����Ҫ����һ�еĳ���
      'max-len': 'off',
      // ����һ���ļ���������
      // @off û��Ҫ����
      'max-lines': 'off',
      // �ص�����Ƕ�׽�ֹ���� 3 �㣬�������� async await ���
      'max-nested-callbacks': [
        'error',
        3
      ],
      // �����Ĳ�����ֹ���� 7 ��
      'max-params': [
        'error',
        7
      ],
      // ���ƺ������е��������
      // @off û��Ҫ����
      'max-statements': 'off',
      // ����һ���е��������
      // @off û��Ҫ����
      'max-statements-per-line': 'off',
      // ��Ԫ���ʽ����û���
      // @off ��Ԫ���ʽ��������ʹ��
      'multiline-ternary': 'off',
      // new �����������������ĸ��д
      'new-cap': [
        'error',
        {
          newIsCap: true,
          capIsNew: false,
          properties: true
        }
      ],
      // @fixable new ������������С����
      'new-parens': 'error',
      // ��ʽ���ñ��뻻��
      // @off û��Ҫ����
      'newline-per-chained-call': 'off',
      // ��ֹʹ�� Array ���캯��
      'no-array-constructor': 'error',
      // ��ֹʹ��λ����
      // @off λ����ܳ���
      'no-bitwise': 'off',
      // ��ֹʹ�� continue
      // @off continue �ܳ���
      'no-continue': 'off',
      // ��ֹ�ڴ�����������ע��
      // @off ����ע�ͺܳ���
      'no-inline-comments': 'off',
      // @fixable ��ֹ else ��ֻ��һ�������� if
      // @off ������ if ���԰��߼����ĸ����
      'no-lonely-if': 'off',
      // ��ֹ���ò�ͬ�Ĳ����������� let foo = a && b < 0 || c > 0 || d + 1 === 0
      // @off ̫�ϸ��ˣ�������ʹ�����Լ�ȥ�ж���λ��ò�����
      'no-mixed-operators': 'off',
      // ��ֹ���ÿո������
      'no-mixed-spaces-and-tabs': 'error',
      // ��ֹ������ֵ������ a = b = c = 5
      // @off û��Ҫ����
      'no-multi-assign': 'off',
      // @fixable ��ֹ���ֳ������е���������
      'no-multiple-empty-lines': [
        'error',
        {
          max: 3,
          maxEOF: 1,
          maxBOF: 1
        }
      ],
      // ��ֹ if �����з񶨵ı��ʽ�����磺
      // if (a !== b) {
      //     doSomething();
      // } else {
      //     doSomethingElse();
      // }
      // @off �񶨵ı��ʽ���԰��߼����ĸ����
      'no-negated-condition': 'off',
      // ��ֹʹ��Ƕ�׵���Ԫ���ʽ������ a ? b : c ? d : e
      // @off û��Ҫ����
      'no-nested-ternary': 'off',
      // ��ֱֹ�� new Object
      'no-new-object': 'error',
      // ��ֹʹ�� ++ �� --
      // @off û��Ҫ����
      'no-plusplus': 'off',
      // ��ֹʹ���ض����﷨
      // @off ����������ĳ��������﷨����ʹ��
      'no-restricted-syntax': 'off',
      // ��ֹʹ�� tabs
      'no-tabs': 'error',
      // ��ֹʹ����Ԫ���ʽ
      // @off ��Ԫ���ʽ�ܳ���
      'no-ternary': 'off',
      // @fixable ��ֹ��β�пո�
      'no-trailing-spaces': 'error',
      // ��ֹ�����������»���
      // @off �»����ڱ������кܳ���
      'no-underscore-dangle': 'off',
      // @fixable ����ʹ�� !a ��� a ? false : true
      // @off ���߱��ĸ�����
      'no-unneeded-ternary': 'off',
      // @fixable ��ֹ����ǰ�пո񣬱��� foo. bar()
      'no-whitespace-before-property': 'error',
      // @fixable ��ֹ if ���治�Ӵ����Ŷ�д���д���
      'nonblock-statement-body-position': [
        'error',
        'beside',
        {
          overrides: {
            while: 'below'
          }
        }
      ],
      // @fixable �������ڵ���β�����л���
      'object-curly-newline': [
        'error',
        {
          multiline: true,
          consistent: true
        }
      ],
      // @fixable ����������ֻ��һ��ʱ���������ڵ���β�����пո�
      'object-curly-spacing': [
        'error',
        'always',
        {
          arraysInObjects: true,
          objectsInObjects: false
        }
      ],
      // @fixable �����������ڵ�����ÿ�б���ֻ��һ��
      // @off û��Ҫ����
      'object-property-newline': 'off',
      // ��ֹ��������ʱ�ö���һ���������
      'one-var': [
        'error',
        'never'
      ],
      // @fixable ������������ÿ��һ��
      'one-var-declaration-per-line': [
        'error',
        'always'
      ],
      // @fixable ����ʹ�� x = x + y ������ x += y
      // @off û��Ҫ����
      'operator-assignment': 'off',
      // @fixable ��Ҫ���е�ʱ�򣬲��������������ĩ�����磺
      // let foo = 1 +
      //     2
      // @off ��ʱ���ڵڶ��п�ʼ�����׶�
      'operator-linebreak': 'off',
      // @fixable �������β����Ҫ����
      // @off û��Ҫ����
      'padded-blocks': 'off',
      // @fixable �������֮��Ŀ��й��򣬱������������֮�����Ҫ����
      // @off û��Ҫ����
      'padding-line-between-statements': 'off',
      // @fixable �����������ļ�����ֹ������������
      // @off û��Ҫ����
      'quote-props': 'off',
      // @fixable ����ʹ�õ����ţ���ֹʹ��˫����
      'quotes': [
        'error',
        'single',
        {
          avoidEscape: true,
          allowTemplateLiterals: true
        }
      ],
      // ����ʹ�� jsdoc ����ע��
      // @off ̫�ϸ���
      'require-jsdoc': 'off',
      // @fixable ��β�����зֺ�
      'semi': [
        'error',
        'always',
        {
          omitLastInOneLineBlock: true
        }
      ],
      // @fixable һ���ж�����ʱ���ֺ�ǰ���ֹ�пո񣬷ֺź�������пո�
      'semi-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],
      // @fixable �ֺű���д����β����ֹ�����׳���
      'semi-style': [
        'error',
        'last'
      ],
      // �����������ļ��������ź���
      // @off û��Ҫ����
      'sort-keys': 'off',
      // �������������ź���
      // @off û��Ҫ����
      'sort-vars': 'off',
      // @fixable if, function �ȵĴ�����֮ǰ����Ҫ�пո񣬱��� if (a) {
      'space-before-blocks': [
        'error',
        'always'
      ],
      // @fixable function ��С����֮ǰ����Ҫ�пո�
      'space-before-function-paren': [
        'error',
        {
          anonymous: 'ignore',
          named: 'never',
          asyncArrow: 'always'
        }
      ],
      // @fixable С�����ڵ���β��ֹ�пո�
      'space-in-parens': [
        'error',
        'never'
      ],
      // @fixable ���������ұ����пո񣬱��� let sum = 1 + 2;
      'space-infix-ops': 'error',
      // @fixable new, typeof �Ⱥ�������пո�++, -- �Ƚ�ֹ�пո񣬱��磺
      // let foo = new Person();
      // bar = bar++;
      'space-unary-ops': [
        'error',
        {
          words: true,
          nonwords: false
        }
      ],
      // @fixable ע�͵�б�߻� * ������пո�
      'spaced-comment': [
        'error',
        'always',
        {
          block: {
            exceptions: [
              '*'
            ],
            balanced: true
          }
        }
      ],
      // @fixable case ��ð��ǰ��ֹ�пո�ð�ź�����пո�
      'switch-colon-spacing': [
        'error',
        {
          after: true,
          before: false
        }
      ],
      // @fixable ģ���ַ����� tag ֮���ֹ�пո񣬱��� tag`Hello World`
      'template-tag-spacing': [
        'error',
        'never'
      ],
      // @fixable �ļ���ͷ��ֹ�� BOM
      'unicode-bom': [
        'error',
        'never'
      ],
      // @fixable ������ʽ���������Ű�����
      // @off û��Ҫ����
      'wrap-regex': 'off',
  
  
  
      //
      //
      // ECMAScript 6
      // ��Щ������ ES6����ͨ����˵�� ES2015���й�
      //
      // @fixable ��ͷ�����ܹ�ʡ�� return ��ʱ�򣬱���ʡ�ԣ��������д�� () => 0����ֹд�� () => { return 0 }
      // @off ��ͷ�����ķ���ֵ��Ӧ�������������
      'arrow-body-style': 'off',
      // @fixable ��ͷ����ֻ��һ��������ʱ�򣬱��������
      // @off Ӧ�������������
      'arrow-parens': 'off',
      // @fixable ��ͷ�����ļ�ͷǰ������пո�
      'arrow-spacing': [
        'error',
        {
          before: true,
          after: true
        }
      ],
      // constructor �б����� super
      'constructor-super': 'error',
      // @fixable generator �� * ǰ���ֹ�пո񣬺�������пո�
      'generator-star-spacing': [
        'error',
        {
          before: false,
          after: true
        }
      ],
      // ��ֹ�Զ������ class ���¸�ֵ
      'no-class-assign': 'error',
      // @fixable ��ֹ�����������ļ�ͷ���������� let x = a => 1 ? 2 : 3
      'no-confusing-arrow': [
        'error',
        {
          allowParens: true
        }
      ],
      // ��ֹ��ʹ�� const ����ĳ������¸�ֵ
      'no-const-assign': 'error',
      // ��ֹ�ظ�������
      'no-dupe-class-members': 'error',
      // ��ֹ�ظ� import ģ��
      'no-duplicate-imports': 'error',
      // ��ֹʹ�� new ������ Symbol
      'no-new-symbol': 'error',
      // ��ֹ import ָ����ģ��
      // @off ����������ĳ�������ģ�鲻��ʹ��
      'no-restricted-imports': 'off',
      // ��ֹ�� super ������֮ǰʹ�� this �� super
      'no-this-before-super': 'error',
      // @fixable ��ֹ����û��Ҫ�ļ������������ let a = { ['0']: 0 };
      'no-useless-computed-key': 'error',
      // ��ֹ����û��Ҫ�� constructor������ constructor(value) { super(value) }
      'no-useless-constructor': 'error',
      // @fixable ��ֹ�⹹ʱ����ͬ�����ֵĵ������������� let { foo: foo } = bar;
      'no-useless-rename': 'error',
      // @fixable ��ֹ���� var
      'no-var': 'error',
      // @fixable ����ʹ�� a = {b} ������ a = {b: b}
      // @off û��Ҫǿ��Ҫ��
      'object-shorthand': 'off',
      // @fixable ����ʹ�ü�ͷ������Ϊ�ص�
      // @off û��Ҫǿ��Ҫ��
      'prefer-arrow-callback': 'off',
      // @fixable �������ٱ��޸ĵı�������ʹ�� const ������
      // @off û��Ҫǿ��Ҫ��
      'prefer-const': 'off',
      // ����ʹ�ý⹹
      // @off û��Ҫǿ��Ҫ��
      'prefer-destructuring': 'off',
      // @fixable ����ʹ�� 0b11111011 ������ parseInt('111110111', 2)
      // @off û��Ҫǿ��Ҫ��
      'prefer-numeric-literals': 'off',
      // ����ʹ�� ...args ������ arguments
      // @off û��Ҫǿ��Ҫ��
      'prefer-rest-params': 'off',
      // @fixable ����ʹ�� ... ������ apply������ foo(...args)
      // @off  apply �ܳ���
      'prefer-spread': 'off',
      // @fixable ����ʹ��ģ���������������ַ�������
      // @off �ַ������Ӻܳ���
      'prefer-template': 'off',
      // generator �����ڱ����� yield
      'require-yield': 'error',
      // @fixable ... �ĺ����ֹ�пո�
      'rest-spread-spacing': [
        'error',
        'never'
      ],
      // @fixable import ���밴��������
      // @off û��Ҫǿ��Ҫ��
      'sort-imports': 'off',
      // ���� Symbol ʱ���봫�����
      'symbol-description': 'error',
      // @fixable ${name} �ڵ���β��ֹ�пո�
      'template-curly-spacing': [
        'error',
        'never'
      ],
      // @fixable yield* �������Ҫ�пո�
      'yield-star-spacing': [
        'error',
        'after'
      ]
  
    }
  
  }
  
