import JSONInput from 'react-json-editor-ajrm';
// @ts-ignore
import locale from 'react-json-editor-ajrm/locale/en';

export default function PasteData({ containerStyle = { 'maxWidth': '100%' }, initialData, onChange, ...rest }: any) {
    return (
        <>
            <div style={containerStyle}>
                <JSONInput
                    placeholder={initialData}
                    width='100%'
                    locale={locale}
                    colors={{
                        string: "#DAA520"
                    }}
                    onChange={onChange}
                    {...rest}
                />
            </div>
        </>
    );
}
