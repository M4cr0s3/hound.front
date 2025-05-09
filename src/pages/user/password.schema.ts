import * as v from 'valibot';

export const schema = v.pipe(
    v.object(
        {
          current_password: v.string(),
          password: v.pipe(v.string(), v.minLength(8)),
          password_confirmation: v.string(),
        }
    ),
    v.forward(
        v.partialCheck(
            [['password'], ['password_confirmation']],
            (input) => input.password === input.password_confirmation,
            'Пароли не совпадают'
        ),
        ['password_confirmation']
    )
);