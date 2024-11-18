export default {
  name: 'SignUpFormInput',
  props: {
    label: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    onChange: {
      type: Function,
      required: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    required: {
      type: Boolean,
      default: true,
    },
  },
  render() {
    const { label, type, id, name, value, onChange, disabled, required } =
      this.$props;

    const handleChange = (e) => {
      onChange(e);
    };

    return (
      <div class="mb-4">
        <label for={id} class="block text-sm font-medium text-gray-700">
          {label}
          <input
            type={type}
            id={id}
            name={name}
            value={value}
            onInput={handleChange}
            disabled={disabled}
            class="block w-full px-3 py-2 mt-1 mb-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            required={required}
          />
        </label>
      </div>
    );
  },
};
